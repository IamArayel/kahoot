import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';

const Question = ({ question, questionNumber, totalQuestions, onAnswer, timeLimit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    // Reset timer when question changes
    setTimeLeft(timeLimit);
    setSelectedAnswer(null);
    setAnswered(false);
  }, [question, timeLimit]);

  useEffect(() => {
    if (answered) return;

    if (timeLeft === 0) {
      handleAnswer(-1); // -1 means no answer selected
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, answered]);

  const handleAnswer = (index) => {
    if (answered) return;

    setSelectedAnswer(index);
    setAnswered(true);

    const isCorrect = index === question.correctAnswer;

    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };

  const getButtonClass = (index) => {
    if (!answered) return 'btn btn-lg neumorphic-button bg-white/80 border-none hover:scale-105 transition-all duration-200';

    if (index === question.correctAnswer) {
      return 'btn btn-lg bg-gradient-to-r from-green-400 to-emerald-500 text-white border-none scale-105 animate-bounce-once';
    }

    if (index === selectedAnswer) {
      return 'btn btn-lg bg-gradient-to-r from-red-400 to-pink-500 text-white border-none scale-95';
    }

    return 'btn btn-lg bg-white/50 border-none opacity-50';
  };

  // Calcul du pourcentage restant pour la barre de temps
  const timeProgress = (timeLeft / timeLimit) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="card w-full max-w-4xl neumorphic bg-white/80 backdrop-blur-sm">
        <div className="card-body">
          <div className="mb-4">
            <ProgressBar current={questionNumber} total={totalQuestions} />
          </div>

          {/* Barre de temps */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className={`h-2.5 rounded-full transition-all duration-1000 linear ${timeLeft <= 5 ? 'bg-red-500' : 'bg-blue-500'}`} 
              style={{ width: `${timeProgress}%` }}
            ></div>
          </div>
          <div className="text-center text-sm font-semibold text-gray-600 mb-4">
            Temps restant : {timeLeft}s
          </div>

          <h2 className="card-title text-3xl mb-8 text-center justify-center font-bold text-gray-800">
            {question.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                className={getButtonClass(index)}
                onClick={() => handleAnswer(index)}
                disabled={answered}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
