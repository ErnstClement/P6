// Appel de Bcrypt pour le hachage du Mot de passe
const bcrypt = require("bcrypt");
// Récupération du modèle User
const User = require("../models/User");
// On récupère notre middleware JWT
const jwt = require("jsonwebtoken");

//-----------Création d'un nouvel utilisateur (middleWare)------------
exports.signup = (req, res, next) => {
  console.log("req.body", req.body);
  // On utilise Bcrypt pour hash le mot de passe, ici le mot de passe fera 10 tours d'algorithme
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Création du nouvel utilisateur
      const user = new User({
        // Récupération de l'email présent dans le corps de la requete
        email: req.body.email,
        // Récupération du mot de passe hashé par Bcrypt
        password: hash,
      });
      user
        .save() // Sauvegarde dans la base de donnée
        .then(() => res.status(201).json({ message: "Utilisateur créé !" })) // Renvoi status 201 pour création d'un nouvel objet User avec message console
        .catch((error) => res.status(400).json({ error })); // Renvoi status 400 si une erreur c'est produite
    })
    .catch((error) => res.status(500).json({ error })); // Renvoi d'un status 500  si l'utilisateur existe déjà
};
//-----------------------------------------------------------

//------MiddleWare pour la connection d'un utilisateur--------
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
          // Renvoi du status 200 avec un objet JSON contenant l'"userId" et un token
          res.status(200).json({
            //Renvoi de la réponse back vers le frond
            userId: user._id,
            token: jwt.sign(
              //On passe le token original dans jwt pour l'encodé
              {
                userId: user._id, // On passe aussi l'userId dans le cas ou cela serait necessaire
              },
              "ENCODAGE_TOKEN", // Clé d'encodage
              {
                expiresIn: "24h", // configuration d'expiration du Token
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
  console.log(res.token);
};

//------------------------------------------------------------------
