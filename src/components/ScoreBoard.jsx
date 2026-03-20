import React from 'react';

const ScoreBoard = ({ score, totalQuestions, onRestart }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

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
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-8">Résultats</h1>

          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h2 className={`text-6xl font-bold ${getColor()}`}>
                {score} / {totalQuestions}
              </h2>
              <p className="text-2xl mt-4">{percentage}%</p>
              <p className="text-xl mt-2">{getMessage()}</p>
            </div>
          </div>

          <div className="stats shadow mb-6">
            <div className="stat">
              <div className="stat-title">Bonnes réponses</div>
              <div className="stat-value text-success">{score}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Mauvaises réponses</div>
              <div className="stat-value text-error">{totalQuestions - score}</div>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" onClick={onRestart}>
            Rejouer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
