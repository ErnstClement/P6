const express = require("express");
const multer = require("../middleware/multer");
const router = express.Router();

const stuffCtrl = require("../controllers/sauces");

router.post("/", multer, stuffCtrl.createSauce);
router.get("/", stuffCtrl.getAllSauce);
router.get("/:id", stuffCtrl.getOneSauce);
// Route qui permet de supprimer "une sauce"
// Supprime la sauce avec l'ID fourni.
router.delete("/:id", stuffCtrl.deleteSauce);

module.exports = router;
