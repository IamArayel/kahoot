import React, { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import ScoreBoard from './components/ScoreBoard';
import AnimatedBackground from './components/AnimatedBackground';
import MusicPlayer from './components/MusicPlayer';
import questionsData from './data/questions.json';

// Fonction pour mélanger un tableau (algorithme de Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function App() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'finished'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [timeLimit, setTimeLimit] = useState(20);

  // État pour stocker les questions qui n'ont pas encore été jouées
  const [availableQuestions, setAvailableQuestions] = useState([]);

  // Initialiser les questions disponibles au premier chargement
  useEffect(() => {
    setAvailableQuestions(questionsData);
  }, []);

  const handleStart = (selectedTimeLimit) => {
    setTimeLimit(selectedTimeLimit || 20);
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setStreak(0);
    
    // S'il n'y a pas assez de questions disponibles pour une partie de 20,
    // on réinitialise avec toutes les questions.
    let currentAvailable = availableQuestions;
    if (currentAvailable.length < 20) {
      currentAvailable = questionsData;
    }

    // On mélange les questions disponibles
    const shuffled = shuffleArray(currentAvailable);
    
    // On sélectionne les 20 premières
    const selectedQuestions = shuffled.slice(0, 20);
    setShuffledQuestions(selectedQuestions);
    
    // On met à jour les questions disponibles en retirant celles qui ont été sélectionnées
    const remainingQuestions = shuffled.slice(20);
    setAvailableQuestions(remainingQuestions);
  };

  const handleAnswer = (isCorrect, timeLeft) => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      
      // Calcul des points
      // 1. Points de base (500 pts)
      const basePoints = 500;
      // 2. Bonus de rapidité (jusqu'à 500 pts, proportionnel au temps restant)
      const speedBonus = Math.round((timeLeft / timeLimit) * 500);
      // 3. Multiplicateur de série (1 + 10% par bonne réponse consécutive)
      const streakMultiplier = 1 + (streak * 0.1);
      
      const pointsEarned = Math.round((basePoints + speedBonus) * streakMultiplier);
      setScore(score + pointsEarned);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < shuffledQuestions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setGameState('finished');
    }
  };

  const handleRestart = () => {
    setGameState('start');
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setStreak(0);
  };

  return (
    <div className="App relative min-h-screen flex flex-col items-center">
      <AnimatedBackground />
      <MusicPlayer isPlaying={gameState !== 'start'} />

      {gameState === 'start' && <StartScreen onStart={handleStart} />}

      {gameState === 'playing' && shuffledQuestions.length > 0 && (
        <div className="w-full flex flex-col items-center pt-16 px-4">
          {/* Affichage du score et de la série au dessus de la question */}
          <div className="flex flex-col items-center gap-2 z-10 mb-4">
            <div className="neumorphic bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl font-bold text-xl text-purple-600 shadow-lg border border-purple-100">
              Score: {score}
            </div>
            {streak >= 3 && (
              <div className="neumorphic bg-gradient-to-r from-orange-400 to-red-500 px-6 py-2 rounded-2xl font-bold text-lg text-white shadow-lg animate-pulse border border-orange-200">
                🔥 Série x{streak}
              </div>
            )}
          </div>
          
          <div className="w-full max-w-4xl -mt-16">
            <Question
              question={shuffledQuestions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={shuffledQuestions.length}
              onAnswer={handleAnswer}
              timeLimit={timeLimit}
            />
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <ScoreBoard
          score={score}
          correctAnswers={correctAnswers}
          totalQuestions={shuffledQuestions.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
