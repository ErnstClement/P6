const express = require("express");
const router = express.Router();

const stuffCtrl = require("../controllers/sauces");

router.post("/", stuffCtrl.createSauce);
router.put("/:id", stuffCtrl.modifySauce);
router.delete("/:id", stuffCtrl.deleteSauce);
router.get("/:id", stuffCtrl.getOneSauce);
router.get("/", stuffCtrl.getAllSauce);

module.exports = router;
