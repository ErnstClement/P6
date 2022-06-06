// Importation de mongoose pour utilisation de la base de donnée
const mongoose = require("mongoose");

// Importation du plugin "mongoose-unique-validator" pour assurer qu'une seule addresse mail existe
const uniqueValidator = require("mongoose-unique-validator");

// Création du schéma pour chaque nouveau utilisateur
const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: [true, "Veuillez entrer une adresse email"],
    unique: true,
  },
  password: { type: String, require: true },
});

// On passe notre schéma avec le plugin pour garantir un email unique
userSchema.plugin(uniqueValidator);

// On exporte le schema
module.exports = mongoose.model("User", userSchema);
