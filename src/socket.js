import { io } from 'socket.io-client';

// En production, il faut mettre l'URL de votre serveur Node.js déployé
// Pour l'instant, si vous hébergez juste le site statique, le serveur Node
// n'est pas hébergé. Il faut un service comme Render, Heroku ou Railway
// pour héberger server.js.
// Exemple: const PROD_URL = "https://mon-serveur-kahoot.onrender.com";

const PROD_URL = "https://kahoot-0e15.onrender.com"; // REMPLACEZ PAR L'URL DE VOTRE SERVEUR DÉPLOYÉ

const SERVER_URL = process.env.NODE_ENV === 'production' 
  ? PROD_URL
  : `${window.location.protocol}//${window.location.hostname}:3001`;

export const socket = io(SERVER_URL, {
  autoConnect: false
});
