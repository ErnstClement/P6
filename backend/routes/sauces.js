const express = require("express");
const router = express.Router();

const stuffCtrl = require("../controllers/sauces");

router.post("/", stuffCtrl.createThing);
router.put("/:id", stuffCtrl.modifyThing);
router.delete("/:id", stuffCtrl.deleteThing);
router.get("/:id", stuffCtrl.findOne);
router.get("/", stuffCtrl.findAll);

module.exports = router;
