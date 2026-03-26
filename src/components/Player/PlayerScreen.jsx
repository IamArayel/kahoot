import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { socket } from '../../socket';

const PlayerScreen = () => {
  const [searchParams] = useSearchParams();
  const [pin, setPin] = useState(searchParams.get('pin') || '');
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');
  const [gameState, setGameState] = useState('lobby'); // lobby, playing, finished
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on('joinedGame', () => {
      setJoined(true);
      setError('');
    });

    socket.on('error', (msg) => {
      setError(msg);
    });

    socket.on('gameStarted', () => {
      setGameState('playing');
    });

    socket.on('newQuestion', () => {
      setAnswered(false); // Réactiver les boutons à la nouvelle question
    });

    socket.on('gameEnded', () => {
      setGameState('finished');
    });

    socket.on('hostDisconnected', () => {
      alert("L'hôte a quitté la partie.");
      window.location.reload();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (pin && username) {
      socket.emit('joinGame', { pin, username });
    }
  };

  const submitAnswer = (index) => {
    if (answered) return;
    setAnswered(true);
    // Le serveur calcule maintenant le temps de réponse automatiquement
    socket.emit('submitAnswer', { pin, answerIndex: index });
  };

  if (!joined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full max-w-md mx-auto">
        <div className="w-full neumorphic p-8 rounded-3xl bg-white/80 backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Rejoindre
          </h1>
          
          {error && (
            <div className="alert alert-error mb-4 rounded-xl text-white">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleJoin} className="flex flex-col gap-6">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-gray-700">Code PIN</span>
              </label>
              <input
                type="text"
                placeholder="123456"
                className="input input-bordered input-lg w-full bg-white/50 text-center tracking-widest font-mono text-2xl"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))} // Accepte que les chiffres
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold text-gray-700">Pseudo</span>
              </label>
              <input
                type="text"
                placeholder="Ton pseudo"
                className="input input-bordered input-lg w-full bg-white/50 text-center text-xl"
                value={username}
                onChange={(e) => setUsername(e.target.value.slice(0, 15))}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-lg w-full neumorphic-button bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none mt-4 hover:scale-105 transition-transform duration-200"
            >
              Entrer
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (gameState === 'lobby') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-6 animate-pulse">Tu es dans la partie !</h2>
        <div className="text-2xl text-white/80 font-semibold bg-black/20 px-8 py-4 rounded-full">
          {username}
        </div>
        <p className="mt-8 text-xl text-white/90">Regarde l'écran principal... ça va bientôt commencer !</p>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">Partie terminée !</h2>
        <p className="text-2xl text-white/90">Regarde le podium sur l'écran principal 🏆</p>
      </div>
    );
  }

  // --- L'INTERFACE DES BOUTONS DE RÉPONSE ---
  // Couleurs Kahoot classiques (Triangle rouge, Losange bleu, Cercle jaune, Carré vert)
  const buttonColors = [
    'bg-red-500 hover:bg-red-600',
    'bg-blue-500 hover:bg-blue-600',
    'bg-yellow-400 hover:bg-yellow-500',
    'bg-green-500 hover:bg-green-600'
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 p-2 sm:p-4 pb-20">
      <div className="text-center py-4 bg-white rounded-2xl shadow-sm mb-4">
        <span className="font-bold text-gray-500 text-sm">Joueur :</span>
        <span className="font-bold text-purple-600 text-lg ml-2">{username}</span>
      </div>

      {answered ? (
        <div className="flex-1 flex flex-col items-center justify-center rounded-3xl bg-gray-200 shadow-inner">
          <div className="loading loading-dots loading-lg text-purple-500"></div>
          <p className="mt-6 text-2xl font-bold text-gray-600">En attente des autres...</p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-2 gap-2 sm:gap-4">
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              className={`${buttonColors[index]} w-full h-full rounded-2xl sm:rounded-3xl shadow-[0_8px_0_rgb(0,0,0,0.2)] active:shadow-[0_0px_0_rgb(0,0,0,0.2)] active:translate-y-2 transition-all duration-100 flex items-center justify-center`}
              onClick={() => submitAnswer(index)}
            >
              {/* Formes géométriques simples pour rappeler Kahoot */}
              {index === 0 && <div className="w-0 h-0 border-l-[30px] border-l-transparent border-b-[50px] border-b-white border-r-[30px] border-r-transparent"></div>}
              {index === 1 && <div className="w-16 h-16 bg-white rotate-45"></div>}
              {index === 2 && <div className="w-16 h-16 bg-white rounded-full"></div>}
              {index === 3 && <div className="w-14 h-14 bg-white"></div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerScreen;