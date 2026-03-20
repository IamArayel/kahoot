import React, { useState } from 'react';

const StartScreen = ({ onStart }) => {
  const [timeLimit, setTimeLimit] = useState(20);

  const handleStartClick = () => {
    onStart(timeLimit);
  };

  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="neumorphic p-10 rounded-3xl bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm">
            <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Kahoot! Quiz
            </h1>
            <p className="py-2 text-lg text-gray-700">
              Testez vos connaissances avec ce quiz interactif !
            </p>
            <div className="form-control w-full max-w-xs mx-auto mb-6">
              <label className="label">
                <span className="label-text text-gray-700 font-semibold">Temps par question (secondes) :</span>
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
                className="input input-bordered w-full max-w-xs bg-white/50"
              />
            </div>
            <button
              className="btn btn-lg neumorphic-button bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:scale-105 transition-transform duration-200"
              onClick={handleStartClick}
            >
              Commencer le Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
