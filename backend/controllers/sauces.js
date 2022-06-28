// Récupération du modèle sauce
const Sauce = require("../models/sauces");

// Récupération du module file-system pour faciliter les modifications sur nos sauces
var fs = require("fs");

//----création d'une nouvelle sauce-----------------
exports.createSauce = (req, res, next) => {
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
  console.log(Sauce);

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
    .catch(
      (error) =>
        res.status(500).json({
          error,
        }),
      console.log(res)
    );
};
console.log(Sauce);
//-------------------------------

//---Modifications des sauces--------

exports.modifySauce = (req, res, next) => {
  let sauceObject = {};
  req.file
    ? // Si la modification contient une image => Utilisation de l'opérateur ternaire comme structure conditionnelle.
      (Sauce.findOne({
        _id: req.params.id,
      }).then((sauce) => {
        // On supprime l'ancienne image du serveur
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlinkSync(`images/${filename}`);
      }),
      (sauceObject = {
        // On modifie les données et on ajoute la nouvelle image
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }))
    : // Opérateur ternaire équivalent à if() {} else {} => condition ? Instruction si vrai : Instruction si faux
      // Si la modification ne contient pas de nouvelle image
      (sauceObject = {
        ...req.body,
      });
  Sauce.updateOne(
    // On applique les paramètre de sauceObject
    {
      _id: req.params.id,
    },
    {
      ...sauceObject,
      _id: req.params.id,
    }
  )
    .then(() =>
      res.status(200).json({
        message: "Sauce modifiée !",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};
//------------------------------

//---Ajout/Suppression des likes-----

exports.likeDislike = (req, res, next) => {
  // Pour la route READ = Ajout/suppression d'un like / dislike à une sauce
  // Like présent dans le body
  let like = req.body.like;
  // On prend le userID
  let userId = req.body.userId;
  // On prend l'id de la sauce
  let sauceId = req.params.id;

  if (like === 1) {
    // Si il s'agit d'un like
    Sauce.updateOne(
      {
        _id: sauceId,
      },
      {
        // On push l'utilisateur et on incrémente le compteur de 1
        $push: {
          usersLiked: userId,
        },
        $inc: {
          likes: +1,
        }, // On incrémente de 1
      }
    )
      .then(() =>
        res.status(200).json({
          message: "j'aime ajouté !",
        })
      )
      .catch((error) =>
        res.status(400).json({
          error,
        })
      );
  }
  if (like === -1) {
    Sauce.updateOne(
      // S'il s'agit d'un dislike
      {
        _id: sauceId,
      },
      {
        $push: {
          usersDisliked: userId,
        },
        $inc: {
          dislikes: +1,
        }, // On incrémente de 1
      }
    )
      .then(() => {
        res.status(200).json({
          message: "Dislike ajouté !",
        });
      })
      .catch((error) =>
        res.status(400).json({
          error,
        })
      );
  }
  if (like === 0) {
    // Si il s'agit d'annuler un like ou un dislike
    Sauce.findOne({
      _id: sauceId,
    })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          // Si il s'agit d'annuler un like
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              $pull: {
                usersLiked: userId,
              },
              $inc: {
                likes: -1,
              }, // On incrémente de -1
            }
          )
            .then(() =>
              res.status(200).json({
                message: "Like retiré !",
              })
            )
            .catch((error) =>
              res.status(400).json({
                error,
              })
            );
        }
        if (sauce.usersDisliked.includes(userId)) {
          // Si il s'agit d'annuler un dislike
          Sauce.updateOne(
            {
              _id: sauceId,
            },
            {
              $pull: {
                usersDisliked: userId,
              },
              $inc: {
                dislikes: -1,
              }, // On incrémente de -1
            }
          )
            .then(() =>
              res.status(200).json({
                message: "Dislike retiré !",
              })
            )
            .catch((error) =>
              res.status(400).json({
                error,
              })
            );
        }
      })
      .catch((error) =>
        res.status(404).json({
          error,
        })
      );
  }
};

//----------------------------------------------------------------
