// Appel des module necessaires au bon déroulement de la gestion des sauces
const express = require("express");
const multer = require("../middleware/multer");
const router = express.Router();
const authentification = require("../middleware/authentification");
const stuffCtrl = require("../controllers/sauces");

// Gestion des routes pour les interactions avec la base de données des sauces
router.post("/", authentification, multer, stuffCtrl.createSauce);
router.get("/", authentification, multer, stuffCtrl.getAllSauce);
router.get("/:id", authentification, multer, stuffCtrl.getOneSauce);
router.delete("/:id", authentification, stuffCtrl.deleteSauce);
router.put("/:id", authentification, multer, stuffCtrl.modifySauce);
router.post("/:id/like", authentification, stuffCtrl.likeDislike);

module.exports = router;
