import React from 'react';

const StartScreen = ({ onStart }) => {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="neumorphic p-10 rounded-3xl bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm">
            <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Kahoot! Quiz
            </h1>
            <p className="py-6 text-lg text-gray-700">
              Testez vos connaissances avec ce quiz interactif !
            </p>
            <button
              className="btn btn-lg neumorphic-button bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:scale-105 transition-transform duration-200"
              onClick={onStart}
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
