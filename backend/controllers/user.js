// Appel de Bcrypt pour le hachage du Mot de passe
const bcrypt = require("bcrypt");
// Récupération du modèle User
const User = require("../models/User");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // Récupération de l'utilisateur qui correspond à l'adresse Email
    .then((user) => {
      if (!user) {
        // Si l'utilisateur n'existe pas
        return res.status(401).json({ error: "Utilisateur introuvable !" }); // retourne un status 401 avec message d'erreur
      }
      bcrypt
        .compare(req.body.password, user.password) // Comparaison du password avec l'outil Bcrypt entre le mot de passe rentré et le mot de passe haché
        .then((valid) => {
          if (!valid) {
            // Si Mot de passe invalide
            return res.status(401).json({ error: "Mot de passe incorrect" }); // retourne un status 401 avec message d'erreur
          }
          res.status(200).json({
            userId: user._id,
            token: "TOKEN",
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
