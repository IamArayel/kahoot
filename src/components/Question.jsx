import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

const Question = ({ question, questionNumber, totalQuestions, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (index) => {
    if (answered) return;

    setSelectedAnswer(index);
    setAnswered(true);

    const isCorrect = index === question.correctAnswer;

    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedAnswer(null);
      setAnswered(false);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="card w-full max-w-4xl neumorphic bg-white/80 backdrop-blur-sm">
        <div className="card-body">
          <div className="mb-6">
            <ProgressBar current={questionNumber} total={totalQuestions} />
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
