# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


---

Pour que les téléphones puissent accéder à l'application qui tourne sur l'ordinateur, il faut deux choses :
1. Que les téléphones et l'ordinateur soient sur la même connexion Wi-Fi.
2. Que l'application utilise l'adresse IP locale de ton ordinateur sur le réseau (ex: `192.168.1.15`) au lieu de `localhost`.

---

1. Dans le fichier `src/socket.js` : Au lieu d'écrire "en dur" http://localhost:3001, l'application va maintenant regarder quelle est l'adresse dans la barre d'URL du navigateur (window.location.hostname) et utiliser cette même IP pour se connecter au port 3001.
2. Dans le fichier `server.js`, le serveur Node écoute toutes les adresses IP du réseau (`0.0.0.0`) et un petit script va afficher l'adresse IP exacte dans le terminal quand il sera lancé.

---

   Ce qu'il faut faire maintenant :
1. Relancer le serveur Node en faisant un Ctrl+C puis `npm run server`. Dans le terminal, il devrait maintenant y avoir quelque chose comme :
    > `📱 Réseau: http://192.168.1.XX:3001`
2. S'assurer que React tourne toujours (sur un autre terminal avec `npm start`).
3. Sur l'écran de l'ordinateur, quand l'écran de l'Hôte s'affiche avec le QR Code : Regarder l'URL dans la barre d'adresse du navigateur. Si elle affiche `localhost:3000`, remplacer le mot `localhost` par l'adresse IP qui s'est affichée dans le terminal (ex: http://192.168.1.XX:3000/host).
4. Une fois que la page est rechargée avec l'IP locale, un nouveau QR Code va se générer (avec la bonne adresse IP !).
5. Scanner le QR Code avec chaque téléphone et profiter de la partie !

---

## Pourquoi je ne peux pas jouer depuis la page Github.io :
> 1. Le problème de la page vierge : le routage sur GitHub Pages dans `src/App.js`, vous utilisiez BrowserRouter. Lorsqu'on déploie une application React sur GitHub Pages (comme configuré dans votre package.json), BrowserRouter pose souvent problème car le serveur statique de GitHub ne sait pas comment gérer les chemins comme /host (il cherche un vrai dossier "host", ne le trouve pas, et renvoie une erreur ou une page blanche). J'ai donc remplacé BrowserRouter par HashRouter dans src/App.js. Cela va rajouter un # dans l'URL (ex: https://IamArayel.github.io/kahoot/#/host), ce qui est parfaitement compatible avec les hébergements statiques !
> 2. Le problème du serveur manquant : Où tourne `server.js` ? Vous hébergez le site React sur GitHub Pages (grâce au script "deploy": "gh-pages -d build"). Cependant, GitHub Pages ne peut héberger que des fichiers statiques (HTML, CSS, JS de React). Il ne peut pas exécuter du code Node.js, ce qui veut dire que votre fichier server.js n'est pas déployé ni exécuté.
> 
> Pour que votre partie multijoueur fonctionne en ligne, vous devez séparer le frontend et le backend :
> 1. Frontend : Reste sur GitHub Pages.
> 2. Backend (Serveur Socket.IO) : Doit être hébergé sur une plateforme gratuite capable de faire tourner Node.js, comme Render, Railway, Fly.io ou Koyeb.
> 
> J'ai préparé le terrain dans src/socket.js. Une fois que vous aurez déployé `server.js` sur Render (ou autre), vous obtiendrez une URL (par exemple https://mon-kahoot.onrender.com). Il vous suffira de :
> 1. Remplacer const PROD_URL = undefined; par votre vraie URL dans src/socket.js.
> 2. Relancer le build et le déploiement de votre site (avec npm run deploy).