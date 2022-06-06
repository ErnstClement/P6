// Récupération du modèle sauce
const Sauce = require("../models/sauces");

//----Gestion d'une nouvelle sauce-----------------
exports.createSauce = (req, res, next) => {
  console.log("req.body", req.body);
  //On récupère les données envoyé par le frontend
  const sauceItem = req.body.sauce;
  // On supprime l'Id envoyé par le frontend, une nouvelle Id sera crée dans la base de donnée MongoDB à la création
  delete sauceItem._id;
  // Création du modele de la nouvelle sauce
  const sauce = new Sauce({
    ...sauceItem,
  });
  sauce
    .save() // Sauvegarde dans la BDD (Base De Donnée)
    .then(() => res.status(201).json({ message: "Objet enrengistré !" })) // Renvoi d'un status 201 avec un objet JSON
    .catch((error) => res.status(400).json({ error })); // renvoi erreur 400 en cas d'erreur
};
//-------------------------------------------------

//-----Modification de sauce existante-------------
exports.modifySauce = (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};
//-------------------------------------------------

//----Suppression d'une sauce----------------------
exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
//--------------------------------------------------

//----Récupération d'une sauce----------------------
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((thing) => res.status(200).json(thing))
    .catch((error) => res.status(400).json({ error }));
};
//--------------------------------------------------

//----Récupération de toutes les sauces-------------
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((things) => res.status(200).json(things))
    .catch((error) => res.status(400).json({ error }));
};
//--------------------------------------------------
