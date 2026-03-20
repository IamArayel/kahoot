import { io } from 'socket.io-client';

// On récupère dynamiquement l'IP locale (ou le nom de domaine) 
// au lieu de forcer 'localhost' pour que le téléphone puisse se connecter
const SERVER_URL = process.env.NODE_ENV === 'production' 
  ? undefined 
  : `${window.location.protocol}//${window.location.hostname}:3001`;

export const socket = io(SERVER_URL, {
  autoConnect: false
});
