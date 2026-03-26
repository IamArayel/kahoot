import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';
import MusicPlayer from './components/MusicPlayer';

import HostScreen from './components/Host/HostScreen';
import PlayerScreen from './components/Player/PlayerScreen';
import Home from './components/Home';

function App() {
  const [userInteracted, setUserInteracted] = useState(false);

  // Gérer la première interaction utilisateur pour autoriser l'autoplay audio
  const handleInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
    }
  };

  return (
    <div onClick={handleInteraction} className="App relative min-h-screen flex flex-col items-center">
      <HashRouter>
        <AnimatedBackground />
        
        {/* Le MusicPlayer est maintenant global pour toutes les pages */}
        <MusicPlayer isPlaying={userInteracted} />

        <Routes>
          {/* Écran d'accueil pour choisir si on host ou on joue */}
          <Route path="/" element={<Home />} />
          
          {/* L'interface principale affichée sur l'écran géant (le jeu complet) */}
          <Route path="/host" element={<HostScreen />} />
          
          {/* L'interface pour les joueurs sur leur téléphone */}
          <Route path="/join" element={<PlayerScreen />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;