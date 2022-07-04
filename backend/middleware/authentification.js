// On commence par récuperer le package Jsonwebtoken (JWT)
const jwt = require("jsonwebtoken");

// on va sécurisée toutes les routes grace au middleware
module.exports = (req, res, next) => {
  try {
    //on récupère les informations dans le header, et on utilise un split pour diviser la chaine de caractère et récuperer celui qui nous interesse
    const token = req.headers.authorization.split(" ")[1];
    // Vérification du token grace a notre clé d'encodage, clé d'encodage que l'on retrouve dans notre user.js
    const decodedToken = jwt.verify(token, "ENCODAGE_TOKEN");
    // On vérifie que le userId envoyé avec la requête correspond au userId encodé dans le token
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "userId non valide";
      res.status(403).json({
        error: "unauthorized request",
      }); // si le token ne correspond pas au userId : erreur
    } else {
      next(); // si tout est valide on passe au prochain middleware
    }
  } catch (error) {
    res.status(401).json({
      error: error | "Requête non authentifiée !",
    });
  }
};
