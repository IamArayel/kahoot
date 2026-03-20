import React from 'react';

const ScoreBoard = ({ score, correctAnswers, totalQuestions, onRestart }) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getMessage = () => {
    if (percentage === 100) return 'Parfait ! 🎉';
    if (percentage >= 80) return 'Excellent ! 🌟';
    if (percentage >= 60) return 'Bien joué ! 👍';
    if (percentage >= 40) return 'Pas mal ! 💪';
    return 'Continue à apprendre ! 📚';
  };

  const getColor = () => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-info';
    if (percentage >= 40) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center w-full max-w-2xl">
        <div className="w-full">
          <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Résultats
          </h1>

          <div className="neumorphic bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8">
            <div className="card-body p-0">
              <h2 className={`text-4xl font-bold ${getColor()} animate-scale-in mb-2`}>
                Score Final : {score}
              </h2>
              <div className="text-2xl font-bold text-gray-700 mt-2 mb-4">
                {correctAnswers} / {totalQuestions} ({percentage}%)
              </div>
              <p className="text-xl mt-2 text-gray-600">{getMessage()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="neumorphic bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl flex flex-col items-center">
              <div className="stat-title text-gray-600 mb-2">Bonnes réponses</div>
              <div className="stat-value text-success text-4xl font-bold">{correctAnswers}</div>
            </div>
            <div className="neumorphic bg-gradient-to-br from-red-100 to-pink-100 p-6 rounded-2xl flex flex-col items-center">
              <div className="stat-title text-gray-600 mb-2">Mauvaises réponses</div>
              <div className="stat-value text-error text-4xl font-bold">{totalQuestions - correctAnswers}</div>
            </div>
          </div>

          <button
            className="btn btn-lg neumorphic-button bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:scale-105 transition-transform duration-200"
            onClick={onRestart}
          >
            Rejouer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
