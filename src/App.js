import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import ScoreBoard from './components/ScoreBoard';
import AnimatedBackground from './components/AnimatedBackground';
import MusicPlayer from './components/MusicPlayer';
import questionsData from './data/questions.json';

function App() {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'finished'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleStart = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questionsData.length) {
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

      {gameState === 'playing' && (
        <Question
          question={questionsData[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questionsData.length}
          onAnswer={handleAnswer}
        />
      )}

      {gameState === 'finished' && (
        <ScoreBoard
          score={score}
          totalQuestions={questionsData.length}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
