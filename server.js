const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

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
// Dans une vraie application, on utiliserait une base de données (Redis, MongoDB...)
const games = new Map();

// Fonction utilitaire pour générer un code PIN à 6 chiffres
const generatePin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

io.on('connection', (socket) => {
  console.log('Un utilisateur s\\'est connecté :', socket.id);

  // --- LOGIQUE DU HOST (Écran Principal) ---

  // L'Host crée une nouvelle partie
  socket.on('createGame', () => {
    let pin = generatePin();
    
    // S'assurer que le PIN est unique
    while(games.has(pin)) {
      pin = generatePin();
    }

    const newGame = {
      hostId: socket.id,
      status: 'lobby', // 'lobby', 'playing', 'finished'
      players: [],
      currentQuestionIndex: -1,
      // On stockera ici les réponses en cours si nécessaire
    };

    games.set(pin, newGame);
    socket.join(pin); // Le socket du Host rejoint la room du PIN
    
    console.log(`Partie créée par ${socket.id} avec le PIN ${pin}`);
    socket.emit('gameCreated', pin);
  });

  // L'Host démarre la partie
  socket.on('startGame', (pin) => {
    const game = games.get(pin);
    if (game && game.hostId === socket.id) {
      game.status = 'playing';
      game.currentQuestionIndex = 0;
      io.to(pin).emit('gameStarted');
      console.log(`Partie ${pin} démarrée`);
    }
  });

  // L'Host passe à la question suivante
  socket.on('nextQuestion', (pin, index) => {
    const game = games.get(pin);
    if (game && game.hostId === socket.id) {
      game.currentQuestionIndex = index;
      io.to(pin).emit('newQuestion', index);
    }
  });

  // L'Host termine la partie
  socket.on('endGame', (pin) => {
    const game = games.get(pin);
    if (game && game.hostId === socket.id) {
      game.status = 'finished';
      io.to(pin).emit('gameEnded');
    }
  });


  // --- LOGIQUE DES JOUEURS (Smartphones) ---

  // Un joueur rejoint une partie avec un PIN et un pseudo
  socket.on('joinGame', ({ pin, username }) => {
    const game = games.get(pin);

    if (!game) {
      socket.emit('error', 'Code PIN invalide. La partie n\\'existe pas.');
      return;
    }

    if (game.status !== 'lobby') {
      socket.emit('error', 'La partie a déjà commencé.');
      return;
    }

    // Vérifier si le pseudo est déjà pris
    const nameTaken = game.players.some(p => p.username.toLowerCase() === username.toLowerCase());
    if (nameTaken) {
      socket.emit('error', 'Ce pseudo est déjà pris dans cette partie.');
      return;
    }

    // Ajouter le joueur
    const newPlayer = {
      id: socket.id,
      username: username,
      score: 0,
      streak: 0
    };

    game.players.push(newPlayer);
    socket.join(pin);

    // Confirmer au joueur qu'il est connecté
    socket.emit('joinedGame', { pin, username });
    
    // Informer le Host (et les autres) qu'un nouveau joueur est arrivé
    io.to(game.hostId).emit('playerJoined', game.players);
    console.log(`${username} (${socket.id}) a rejoint la partie ${pin}`);
  });

  // Un joueur soumet une réponse
  socket.on('submitAnswer', ({ pin, answerIndex, timeToAnswer }) => {
    const game = games.get(pin);
    if (game && game.status === 'playing') {
      // On transmet l'info de la réponse uniquement au Host pour qu'il la traite
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
    console.log('Utilisateur déconnecté :', socket.id);
    
    // Parcourir toutes les parties pour voir où était le joueur ou s'il était Host
    for (const [pin, game] of games.entries()) {
      
      // Si c'était l'Host, on ferme la partie (ou on la met en pause)
      if (game.hostId === socket.id) {
        io.to(pin).emit('hostDisconnected');
        games.delete(pin);
        console.log(`L'Host a quitté. Partie ${pin} supprimée.`);
        break;
      }

      // Si c'était un joueur, on l'enlève de la liste
      const playerIndex = game.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        const username = game.players[playerIndex].username;
        game.players.splice(playerIndex, 1);
        
        // On prévient l'Host de la déconnexion
        io.to(game.hostId).emit('playerLeft', game.players);
        console.log(`${username} a quitté la partie ${pin}`);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Le serveur Socket.IO tourne sur le port ${PORT}`);
});
