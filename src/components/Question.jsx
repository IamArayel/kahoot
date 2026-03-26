import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';

const Question = ({ question, questionNumber, totalQuestions, onAnswer, timeLimit, forceEnd }) => {
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

    if (timeLeft === 0 || forceEnd) {
      handleAnswer(-1, timeLeft); // -1 means no answer selected directly on screen, time left passed
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, answered, forceEnd]);

  const handleAnswer = (index, forcedTimeLeft = null) => {
    if (answered) return;

    const actualTimeLeft = forcedTimeLeft !== null ? forcedTimeLeft : timeLeft;
    setSelectedAnswer(index);
    setAnswered(true);

    const isCorrect = index === question.correctAnswer;

    setTimeout(() => {
      onAnswer(isCorrect, actualTimeLeft);
    }, 1500);
  };

  const getButtonClass = (index) => {
    // Couleurs de base de type Kahoot
    const baseColors = [
      'bg-red-500',    // 0: Triangle rouge
      'bg-blue-500',   // 1: Losange bleu
      'bg-yellow-400', // 2: Cercle jaune
      'bg-green-500'   // 3: Carré vert
    ];

    if (!answered) return `w-full h-full min-h-[120px] rounded-2xl sm:rounded-3xl shadow-[0_8px_0_rgb(0,0,0,0.2)] flex items-center p-4 text-white text-xl font-bold transition-all duration-200 ${baseColors[index]}`;

    if (index === question.correctAnswer) {
      return `w-full h-full min-h-[120px] rounded-2xl sm:rounded-3xl shadow-[0_8px_0_rgb(0,0,0,0.2)] flex items-center p-4 text-white text-xl font-bold scale-105 animate-bounce-once ${baseColors[index]}`;
    }

    return `w-full h-full min-h-[120px] rounded-2xl sm:rounded-3xl shadow-[0_8px_0_rgb(0,0,0,0.2)] flex items-center p-4 text-white text-xl font-bold opacity-30 grayscale ${baseColors[index]}`;
  };

  const getShape = (index) => {
    switch (index) {
      case 0:
        return <div className="w-0 h-0 border-l-[20px] border-l-transparent border-b-[35px] border-b-white border-r-[20px] border-r-transparent mr-4 flex-shrink-0"></div>;
      case 1:
        return <div className="w-10 h-10 bg-white rotate-45 mr-4 flex-shrink-0"></div>;
      case 2:
        return <div className="w-10 h-10 bg-white rounded-full mr-4 flex-shrink-0"></div>;
      case 3:
        return <div className="w-9 h-9 bg-white mr-4 flex-shrink-0"></div>;
      default:
        return null;
    }
  };

  // Calcul du pourcentage restant pour la barre de temps
  const timeProgress = (timeLeft / timeLimit) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-16">
      <div className="card w-full max-w-5xl neumorphic bg-white/80 backdrop-blur-sm">
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

          <h2 className="card-title text-3xl mb-8 text-center justify-center font-bold text-gray-800 bg-white p-8 rounded-2xl shadow-sm">
            {question.question}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={getButtonClass(index)}
              >
                {getShape(index)}
                <span className="flex-1 text-left break-words drop-shadow-md">{option}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Question;
