import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <div className="neumorphic p-10 rounded-3xl bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-sm">
            <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Kahoot! Clone
            </h1>
            
            <div className="flex flex-col gap-4 mt-8">
              <button
                className="btn btn-lg neumorphic-button bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:scale-105 transition-transform duration-200"
                onClick={() => navigate('/host')}
              >
                🖥️ Héberger une partie (Host)
              </button>
              
              <div className="divider text-gray-400">OU</div>
              
              <button
                className="btn btn-lg neumorphic-button bg-white text-purple-600 border-none hover:scale-105 transition-transform duration-200"
                onClick={() => navigate('/join')}
              >
                📱 Rejoindre une partie (Joueur)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
