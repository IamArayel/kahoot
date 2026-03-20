import React, { useState, useEffect } from 'react';
import { socket } from '../../socket';
import { QRCodeSVG } from 'qrcode.react';

// Ici nous migrerons ton ancienne logique de App.js petit à petit
// Pour l'instant on fait juste l'écran d'attente / Lobby

const HostScreen = () => {
  const [pin, setPin] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    // 1. Se connecter au serveur Socket
    socket.connect();

    // 2. Demander la création d'une partie
    socket.emit('createGame');

    // 3. Écouter la réponse du serveur
    socket.on('gameCreated', (newPin) => {
      setPin(newPin);
    });

    socket.on('playerJoined', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on('playerLeft', (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    // Nettoyage lors du démontage du composant
    return () => {
      socket.disconnect();
    };
  }, []);

  const startGame = () => {
    if (players.length > 0) {
      socket.emit('startGame', pin);
      setGameStarted(true);
    } else {
      alert('Il faut au moins un joueur pour démarrer la partie !');
    }
  };

  if (gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
         <h2 className="text-3xl font-bold text-white mb-4">La partie a commencé !</h2>
         <p className="text-white text-xl">Ici on intégrera ton ancien composant Question avec la gestion des réponses des téléphones.</p>
         {/* TODO: Intégrer l'ancien flux App.js (Question, Timer, Scores...) */}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen pt-10">
      <div className="w-full max-w-4xl p-8 neumorphic bg-white/80 backdrop-blur-sm rounded-3xl text-center">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
          Rejoignez la partie !
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-10">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">Scannez ce QR Code</h2>
            <div className="bg-white p-4 rounded-xl shadow-lg border-4 border-purple-500">
              {pin && (
                <QRCodeSVG 
                  value={`${window.location.origin}/join?pin=${pin}`} 
                  size={200}
                  level={"H"}
                />
              )}
            </div>
            <p className="mt-4 text-gray-500">Ou allez sur <span className="font-bold">{window.location.host}/join</span></p>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">Code de la salle (PIN)</h2>
            <div className="text-7xl font-black text-gray-800 tracking-widest bg-gray-100 py-4 px-8 rounded-2xl shadow-inner border border-gray-200">
              {pin || '...'}
            </div>
          </div>
        </div>

        <div className="divider text-gray-400">Joueurs ({players.length})</div>

        <div className="flex flex-wrap justify-center gap-4 min-h-[100px] mb-8">
          {players.length === 0 ? (
            <p className="text-xl text-gray-500 italic flex items-center gap-2">
               <span className="loading loading-spinner loading-md"></span> En attente de joueurs...
            </p>
          ) : (
            players.map((player) => (
              <div key={player.id} className="neumorphic bg-purple-100 px-6 py-3 rounded-full font-bold text-xl text-purple-700 animate-scale-in">
                {player.username}
              </div>
            ))
          )}
        </div>

        <button
          onClick={startGame}
          disabled={players.length === 0}
          className="btn btn-lg neumorphic-button bg-gradient-to-r from-green-400 to-emerald-500 text-white border-none hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:hover:scale-100"
        >
          Démarrer la partie !
        </button>
      </div>
    </div>
  );
};

export default HostScreen;
