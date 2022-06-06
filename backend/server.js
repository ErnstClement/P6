// Importation du pack http
const http = require("http");
// Importation de app pour utilisation sur le serveur
const app = require("./app");
// Importation du middleware Cors pour les autorisations d'utilisations
const cors = require("cors");
// utilisation du middleware CORS dans notre application serveur
app.use(cors());

// Gestion des ports, ici le port 3000 sera utilisé
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Gestion des erreurs
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du server incluant tout l'environnement App
const server = http.createServer(app);

server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// Le serveur écoute le "port", configuré plus haut
server.listen(port);
