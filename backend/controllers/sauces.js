// Récupération du modèle sauce
const Sauce = require("../models/sauces");

//----création d'une nouvelle sauce-----------------
exports.createSauce = (req, res, next) => {
  console.log("req.body", req.body);
  //On récupère les données envoyé par le frontend
  const sauceItem = JSON.parse(req.body.sauce);
  // On supprime l'Id envoyé par le frontend, une nouvelle Id sera crée dans la base de donnée MongoDB à la création
  delete sauceItem._id;
  // Création du modele de la nouvelle sauce
  const sauce = new Sauce({
    ...sauceItem,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save() // Sauvegarde dans la BDD (Base De Donnée)
    .then(() => res.status(201).json({ message: "Objet enrengistré !" })) // Renvoi d'un status 201 avec un objet JSON
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    }); // renvoi erreur 400 en cas d'erreur
};
//-------------------------------------------------

//-----Récupération de toutes les sauces------------

exports.getAllSauce = (req, res, next) => {
  // On utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base, l'array de toutes les sauves de la base de données
  Sauce.find()
    // Si OK on retourne un tableau de toutes les données
    .then((sauces) => res.status(200).json(sauces))
    // Si erreur on retourne un message d'erreur
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};

//----------------------------------

//---Récupération d'une seule sauce---

exports.getOneSauce = (req, res, next) => {
  // On utilise la méthode findOne et on lui passe l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requête
  Sauce.findOne({
    _id: req.params.id,
  })
    // Si ok on retourne une réponse et l'objet
    .then((sauce) => res.status(200).json(sauce))
    // Si erreur on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
    .catch((error) =>
      res.status(404).json({
        error,
      })
    );
};

//---Suppression d'une sauce----------------
exports.deleteSauce = (req, res, next) => {
  // Avant de suppr l'objet, on va le chercher pour obtenir l'url de l'image et supprimer le fichier image de la base
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      // Pour extraire ce fichier, on récupère l'url de la sauce, et on le split autour de la chaine de caractères, donc le nom du fichier
      const filename = sauce.imageUrl.split("/images/")[1];
      // Avec ce nom de fichier, on appelle unlink pour suppr le fichier
      fs.unlink(`images/${filename}`, () => {
        // On supprime le document correspondant de la base de données
        Sauce.deleteOne({
          _id: req.params.id,
        })
          .then(() =>
            res.status(200).json({
              message: "Sauce supprimée !",
            })
          )
          .catch((error) =>
            res.status(400).json({
              error,
            })
          );
      });
    })
    .catch((error) =>
      res.status(500).json({
        error,
      })
    );
};
console.log(Sauce);
//-------------------------------
