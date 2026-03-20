import { io } from 'socket.io-client';

// 'autoConnect: false' pour éviter de se connecter dès l'importation
// mais plutôt quand le composant Host ou Player se monte.
// On utilise localhost:3001 pour le développement (l'URL où tourne notre server.js)
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3001';

export const socket = io(URL, {
  autoConnect: false
});
