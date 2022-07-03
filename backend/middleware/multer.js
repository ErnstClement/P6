/*// Importation de multer pour gerer les nouveaux fichiers
const multer = require("multer");

// Type de fichiers autorisé
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Création de la destination ou multer va enrengistrer les images et les gerer ensuite
const storage = multer.diskStorage({
  // Destination d'enregistrement des images
  destination: (req, file, callback) => {
    // on fait un callback du dossier images vers le backend
    callback(null, "images");
  },
  // Définition du nom de fichier à utiliser
  filename: (req, file, callback) => {
    // Création d'un nouveau nom de fichier avec un split pour remplacer les espaces par des underscores
    let name = file.originalname.split(" ").join("_");
    let extension = MIME_TYPES[file.mimetype];
    name = name.replace("." + extension, "_");

    // Callback et création du filename, ajout d'une date et ajout de l'extension avec les mimetypes paramétré plus haut
    callback(null, name + Date.now() + "." + extension);
  },
});

// Exportation du module, on insère "storage", et on ajoute une methode single image pour lui definir que c'est une image Unique
module.exports = multer({
  storage: storage,
}).single("image");
*/
// Appel du module Multer pour la gestion des images

const multer = require("multer");

// Type de fichiers autorisé

const MYME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Création de la destination ou multer va enrengistrer les images et les gerer ensuite

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    // Suppression des espaces dans le nom du fichier
    const name = file.originalname.split(" ").join("_");
    const extension = MYME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});
module.exports = multer({ storage }).single("image");
