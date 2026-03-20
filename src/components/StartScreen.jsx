import React from 'react';

const StartScreen = ({ onStart }) => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold mb-8">Kahoot! Quiz</h1>
          <p className="py-6 text-lg">
            Testez vos connaissances avec ce quiz interactif !
          </p>
          <button className="btn btn-primary btn-lg" onClick={onStart}>
            Commencer le Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
