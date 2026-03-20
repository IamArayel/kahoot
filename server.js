const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
// Optionnel mais pratique pour afficher l'IP locale dans la console
const os = require('os');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // En développement on autorise tout
    methods: ['GET', 'POST']
  }
});

// Stockage de l'état des parties en mémoire
const games = new Map();

// Fonction utilitaire pour générer un code PIN à 6 chiffres
const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

io.on('connection', (socket) => {
  console.log(`Un utilisateur s'est connecté : ${socket.id}`);

  // --- LOGIQUE DU HOST (Écran Principal) ---
  socket.on('createGame', () => {
    let pin = generatePin();
    while(games.has(pin)) {
      pin = generatePin();
    }

    const newGame = {
      hostId: socket.id,
      status: 'lobby',
      players: [],
      currentQuestionIndex: -1,
    };

    games.set(pin, newGame);
    socket.join(pin);
    
    console.log(`Partie créée par ${socket.id} avec le PIN ${pin}`);
    socket.emit('gameCreated', pin);
  });

  socket.on('startGame', (pin) => {
    const game = games.get(pin);
    if (game && game.hostId === socket.id) {
      game.status = 'playing';
      game.currentQuestionIndex = 0;
      io.to(pin).emit('gameStarted');
      console.log(`Partie ${pin} démarrée`);
    }
  });

  socket.on('nextQuestion', (pin, index) => {
    const game = games.get(pin);
    if (game && game.hostId === socket.id) {
      game.currentQuestionIndex = index;
      io.to(pin).emit('newQuestion', index);
    }
  });

  socket.on('endGame', (pin) => {
    const game = games.get(pin);
    if (game && game.hostId === socket.id) {
      game.status = 'finished';
      io.to(pin).emit('gameEnded');
    }
  });

  // --- LOGIQUE DES JOUEURS (Smartphones) ---
  socket.on('joinGame', ({ pin, username }) => {
    const game = games.get(pin);

    if (!game) {
      socket.emit('error', "Code PIN invalide. La partie n'existe pas.");
      return;
    }

    if (game.status !== 'lobby') {
      socket.emit('error', 'La partie a déjà commencé.');
      return;
    }

    const nameTaken = game.players.some(p => p.username.toLowerCase() === username.toLowerCase());
    if (nameTaken) {
      socket.emit('error', 'Ce pseudo est déjà pris dans cette partie.');
      return;
    }

    const newPlayer = {
      id: socket.id,
      username: username,
      score: 0,
      streak: 0
    };

    game.players.push(newPlayer);
    socket.join(pin);

    socket.emit('joinedGame', { pin, username });
    io.to(game.hostId).emit('playerJoined', game.players);
    console.log(`${username} (${socket.id}) a rejoint la partie ${pin}`);
  });

  socket.on('submitAnswer', ({ pin, answerIndex, timeToAnswer }) => {
    const game = games.get(pin);
    if (game && game.status === 'playing') {
      const player = game.players.find(p => p.id === socket.id);
      if (player) {
        io.to(game.hostId).emit('playerAnswered', {
          playerId: socket.id,
          username: player.username,
          answerIndex,
          timeToAnswer
        });
      }
    }
  });

  // --- GESTION DES DÉCONNEXIONS ---
  socket.on('disconnect', () => {
    console.log(`Utilisateur déconnecté : ${socket.id}`);
    
    for (const [pin, game] of games.entries()) {
      if (game.hostId === socket.id) {
        io.to(pin).emit('hostDisconnected');
        games.delete(pin);
        console.log(`L'Host a quitté. Partie ${pin} supprimée.`);
        break;
      }

      const playerIndex = game.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const username = game.players[playerIndex].username;
        game.players.splice(playerIndex, 1);
        io.to(game.hostId).emit('playerLeft', game.players);
        console.log(`${username} a quitté la partie ${pin}`);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

// Fonction pour récupérer l'IP locale (utile pour le log)
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
};

server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp();
  console.log(`=========================================`);
  console.log(`🚀 Le serveur Socket.IO est lancé !`);
  console.log(`👉 Local:   http://localhost:${PORT}`);
  console.log(`📱 Réseau:  http://${ip}:${PORT}`);
  console.log(`=========================================`);
});
