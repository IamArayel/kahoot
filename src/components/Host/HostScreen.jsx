import React, { useState, useEffect } from 'react';
import { socket } from '../../socket';
import { QRCodeSVG } from 'qrcode.react';
import Question from '../Question';
import questionsData from '../../data/questions.json';

const HostScreen = () => {
  const [pin, setPin] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState('lobby'); // lobby, get_ready, question, leaderboard, final
  
  // États pour le jeu
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersCount, setAnswersCount] = useState(0);

  useEffect(() => {
    // Sélectionner 20 questions aléatoires au montage
    const shuffled = [...questionsData].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 20));

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

    // Écouter quand un joueur répond
    socket.on('playerAnswered', ({ playerId, username, answerIndex, timeToAnswer }) => {
      setAnswersCount((prev) => prev + 1);
      
      // Mettre à jour le score du joueur s'il a bon
      setPlayers((prevPlayers) => {
        return prevPlayers.map(p => {
          if (p.id === playerId) {
            // Logique de score temporaire, on vérifiera la réponse correcte plus tard
            return {
              ...p,
              lastAnswer: answerIndex,
              lastAnswerTime: timeToAnswer
            };
          }
          return p;
        });
      });
    });

    // Nettoyage lors du démontage du composant
    return () => {
      socket.disconnect();
    };
  }, []);

  // Gérer l'écran de chargement / Préparez-vous
  useEffect(() => {
    if (gameState === 'get_ready') {
      const timer = setTimeout(() => {
        socket.emit('nextQuestion', pin, currentQuestionIndex);
        setGameState('question');
        setAnswersCount(0);
      }, 5000); // 5 secondes pour lire la question avant que les réponses apparaissent
      
      return () => clearTimeout(timer);
    }
  }, [gameState, currentQuestionIndex, pin]);

  const startGame = () => {
    if (players.length > 0) {
      socket.emit('startGame', pin);
      setGameState('get_ready');
    } else {
      alert('Il faut au moins un joueur pour démarrer la partie !');
    }
  };

  const handleTimeUpOrAllAnswered = (isCorrect, timeLeft) => {
    // Calculer les scores
    const currentQuestion = questions[currentQuestionIndex];
    
    setPlayers(prevPlayers => {
      const updatedPlayers = prevPlayers.map(p => {
        if (p.lastAnswer === currentQuestion.correctAnswer) {
          // Formule de score basique (1000 max par question, selon la rapidité)
          const timeBonus = (p.lastAnswerTime / 10) * 500;
          return {
            ...p,
            score: p.score + 500 + Math.round(timeBonus),
            streak: p.streak + 1
          };
        } else {
          return {
            ...p,
            streak: 0
          };
        }
      });
      
      // Trier par score
      return updatedPlayers.sort((a, b) => b.score - a.score);
    });

    setGameState('leaderboard');
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      // Réinitialiser la dernière réponse des joueurs
      setPlayers(prev => prev.map(p => ({ ...p, lastAnswer: null })));
      
      setGameState('get_ready');
    } else {
      socket.emit('endGame', pin);
      setGameState('final');
    }
  };

  // --- RENDUS CONDITIONNELS SELON L'ÉTAT ---

  if (gameState === 'get_ready' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center w-full">
        <h2 className="text-3xl font-bold text-white mb-4 animate-bounce">Préparez-vous !</h2>
        <div className="w-full max-w-4xl p-12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl animate-scale-in">
          <span className="text-xl font-bold text-purple-500 mb-4 block">Question {currentQuestionIndex + 1}</span>
          <h1 className="text-5xl font-black text-gray-800 leading-tight">
            {currentQuestion.question}
          </h1>
          <div className="mt-8">
            <span className="loading loading-dots loading-lg text-purple-600"></span>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'question' && questions.length > 0) {
    // On force Question.jsx à finir plus tôt si tout le monde a répondu
    const allAnswered = answersCount >= players.length && players.length > 0;
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="w-full">
        <div className="fixed top-4 right-20 bg-white/80 p-4 rounded-xl shadow-lg z-50">
          <p className="font-bold text-xl">Réponses: {answersCount} / {players.length}</p>
        </div>
        
        <Question
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          timeLimit={10} // 10 secondes par défaut
          onAnswer={handleTimeUpOrAllAnswered}
          forceEnd={allAnswered}
        />
      </div>
    );
  }

  if (gameState === 'leaderboard') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full">
        <h2 className="text-5xl font-bold text-white mb-8">Classement 🏆</h2>
        
        <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-8">
          {players.slice(0, 5).map((player, index) => (
            <div 
              key={player.id} 
              className={`flex justify-between items-center p-4 mb-4 rounded-2xl ${
                index === 0 ? 'bg-yellow-100 border-2 border-yellow-400' : 
                index === 1 ? 'bg-gray-100 border-2 border-gray-300' :
                index === 2 ? 'bg-orange-100 border-2 border-orange-300' :
                'bg-blue-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-400">#{index + 1}</span>
                <span className="text-2xl font-bold text-gray-800">{player.username}</span>
                {player.streak >= 3 && <span className="text-xl" title="En feu !">🔥 x{player.streak}</span>}
              </div>
              <span className="text-3xl font-black text-purple-600">{player.score}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={nextQuestion}
          className="btn btn-lg bg-blue-500 hover:bg-blue-600 text-white border-none shadow-xl px-12 text-2xl"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Question Suivante ➡️' : 'Voir le Podium Final 🏆'}
        </button>
      </div>
    );
  }

  if (gameState === 'final') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full">
         <h1 className="text-6xl font-black text-white mb-12 animate-bounce">Podium Final 🎉</h1>
         
         <div className="flex items-end justify-center gap-4 h-[400px]">
            {/* 2ème place */}
            {players[1] && (
              <div className="flex flex-col items-center animate-slide-up">
                <div className="text-2xl font-bold text-white mb-2">{players[1].username}</div>
                <div className="text-xl text-white/80 mb-2">{players[1].score} pts</div>
                <div className="w-32 h-48 bg-gray-300 rounded-t-lg flex justify-center pt-4 shadow-2xl border-t-4 border-gray-400">
                  <span className="text-4xl font-bold text-gray-500">2</span>
                </div>
              </div>
            )}

            {/* 1ère place */}
            {players[0] && (
              <div className="flex flex-col items-center z-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl">👑</div>
                <div className="text-3xl font-bold text-white mb-2">{players[0].username}</div>
                <div className="text-2xl text-white/80 mb-2 font-bold">{players[0].score} pts</div>
                <div className="w-40 h-64 bg-yellow-400 rounded-t-lg flex justify-center pt-4 shadow-2xl border-t-4 border-yellow-500">
                  <span className="text-5xl font-black text-yellow-600">1</span>
                </div>
              </div>
            )}

            {/* 3ème place */}
            {players[2] && (
              <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="text-2xl font-bold text-white mb-2">{players[2].username}</div>
                <div className="text-xl text-white/80 mb-2">{players[2].score} pts</div>
                <div className="w-32 h-36 bg-orange-400 rounded-t-lg flex justify-center pt-4 shadow-2xl border-t-4 border-orange-500">
                  <span className="text-4xl font-bold text-orange-600">3</span>
                </div>
              </div>
            )}
         </div>

         <button 
           onClick={() => window.location.reload()}
           className="mt-16 btn btn-lg bg-white text-purple-600 border-none shadow-xl hover:scale-105"
         >
           Créer une nouvelle partie
         </button>
      </div>
    );
  }

  // --- LOBBY (Par défaut) ---
  return (
    <div className="flex flex-col items-center min-h-screen pt-10 w-full">
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
                  value={`${window.location.origin}${window.location.pathname}#/join?pin=${pin}`} 
                  size={200}
                  level={"H"}
                />
              )}
            </div>
            <p className="mt-4 text-gray-500">Ou allez sur <span className="font-bold">{window.location.host}{window.location.pathname}#/join</span></p>
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