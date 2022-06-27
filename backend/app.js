// Importation d'express
const express = require("express");
// Importation de Mongoose pour acces a la base de donnée Mongo-DB
const mongoose = require("mongoose");
// Ajout du plugin Path
const path = require("path");

// Déclaration des routes----------------

// Imporation de la route sauces
const saucesRoutes = require("./routes/sauces");
// Importation de la route user
const userRoutes = require("./routes/user");
//-----------------------------------

// Connection a mongoose
mongoose
  .connect(
    "mongodb+srv://CErnst:OpenClassRoomP6@cluster0.rs4frvy.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Création de l'application Express
const app = express();

// Transformation des données en objet JSON exploitable
app.use(express.json());

// Utilisation du middleware Header pour éviter les erreurs de CORS (autoriser les requetes depuis n'importe quelle endroit)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Gestion de la ressource image de façon statique
// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
//app.use("/images", express.static(path.join(__dirname, "images")));

// Utilisation des 2 routes dédiées pour sauces et auth
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

app.use("/images", express.static(path.join(__dirname, "images")));

// Export de l'application Express vers server.js
module.exports = app;
