import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AnimatedBackground from './components/AnimatedBackground';

// On va créer ces composants dans les prochaines étapes
import HostScreen from './components/Host/HostScreen';
import PlayerScreen from './components/Player/PlayerScreen';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <div className="App relative min-h-screen flex flex-col items-center">
        <AnimatedBackground />
        
        <Routes>
          {/* Écran d'accueil pour choisir si on host ou on joue */}
          <Route path="/" element={<Home />} />
          
          {/* L'interface principale affichée sur l'écran géant (le jeu complet) */}
          <Route path="/host" element={<HostScreen />} />
          
          {/* L'interface pour les joueurs sur leur téléphone */}
          <Route path="/join" element={<PlayerScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
