### 📊 État actuel du projet
1. Architecture Multijoueur (Host vs Player) : En place et fonctionnelle. Le backend (`server.js`) gère la création de la salle, les connexions par code PIN et les déconnexions.
2. Cycle de jeu (HostScreen) : La boucle complète est implémentée (`Lobby ➡️ Question ➡️ Leaderboard ➡️ Podium Final`).
3. Déploiement : Le projet a été préparé pour être déployé (passage à HashRouter pour GitHub Pages, et URL dynamique pour le serveur dans `socket.js`).
4. Composants obsolètes : Des composants de l'ancienne version "solo" (`StartScreen.jsx`, `ScoreBoard.jsx`) sont toujours présents, mais ne sont plus utilisés puisque `HostScreen.jsx` s'en charge maintenant.
5. Composants orphelins : Le `MusicPlayer.jsx` a été écarté de l'arbre de rendu principal pendant le refactoring multijoueur.

### 🎯 Les TODOs restants et ce qui manque
1. Le système de points et chronomètre (TODO dans PlayerScreen/HostScreen) : Actuellement, le `PlayerScreen` envoie un temps de réponse "fictif" codé en dur (`timeToAnswer: 10`), ce qui fait que tout le monde obtient le même bonus de temps.
2. La coupure du chrono (TODO dans HostScreen) : La fonction `forceEnd` est passée à `Question.jsx` pour stopper le temps quand tout le monde a répondu. Elle est partiellement supportée mais peut nécessiter un petit ajustement pour s'assurer que l'UI réagit correctement et coupe le timer instantanément.
3. Ambiance sonore : Réintégrer le lecteur de musique pour l'écran de l'hôte afin de remettre de la vie dans la partie.

---

### 🚀 Prochaine étape proposée :
1. Ré-intégrer les questions.
2. Fixer le chronomètre et le score : Au lieu de faire confiance au téléphone (qui envoie `10`), nous allons faire en sorte que l'`HostScreen` calcule lui-même combien de temps le joueur a mis pour répondre (en mesurant le temps écoulé depuis le début de la question).
3. Réintégrer le `MusicPlayer` dans le `HostScreen` pour avoir la musique pendant que les joueurs rejoignent et jouent.
4. Nettoyer les vieux composants (`StartScreen.jsx` et `ScoreBoard.jsx`) pour garder le projet propre.