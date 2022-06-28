const express = require("express");
const multer = require("../middleware/multer");
const router = express.Router();
const authentification = require("../middleware/authentification");
const stuffCtrl = require("../controllers/sauces");

router.post("/", authentification, multer, stuffCtrl.createSauce);
router.get("/", authentification, multer, stuffCtrl.getAllSauce);
router.get("/:id", authentification, multer, stuffCtrl.getOneSauce);

// Route qui permet de supprimer "une sauce"
// Supprime la sauce avec l'ID fourni.
router.delete("/:id", stuffCtrl.deleteSauce);

router.put("/:id", authentification, multer, stuffCtrl.modifySauce);
router.post("/:id/like", authentification, stuffCtrl.likeDislike);

module.exports = router;
