import React, { useState } from 'react';

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
    if (!answered) return 'btn btn-lg btn-outline';

    if (index === question.correctAnswer) {
      return 'btn btn-lg btn-success';
    }

    if (index === selectedAnswer) {
      return 'btn btn-lg btn-error';
    }

    return 'btn btn-lg btn-outline opacity-50';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary to-secondary p-4">
      <div className="card w-full max-w-4xl bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <div className="badge badge-lg badge-primary">
              Question {questionNumber} / {totalQuestions}
            </div>
            <progress
              className="progress progress-primary w-56"
              value={questionNumber}
              max={totalQuestions}
            ></progress>
          </div>

          <h2 className="card-title text-3xl mb-8 text-center justify-center">
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
