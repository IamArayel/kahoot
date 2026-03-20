import React, { useState } from 'react';
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
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const handleStart = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    // On mélange toutes les questions puis on en sélectionne seulement 20
    const shuffled = shuffleArray(questionsData);
    setShuffledQuestions(shuffled.slice(0, 20));
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
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
  };

  return (
    <div className="App relative">
      <AnimatedBackground />
      <MusicPlayer isPlaying={gameState !== 'start'} />

      {gameState === 'start' && <StartScreen onStart={handleStart} />}

      {gameState === 'playing' && shuffledQuestions.length > 0 && (
        <Question
          question={shuffledQuestions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={shuffledQuestions.length}
          onAnswer={handleAnswer}
        />
      )}

      {gameState === 'finished' && (
        <ScoreBoard
          score={score}
          totalQuestions={shuffledQuestions.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
