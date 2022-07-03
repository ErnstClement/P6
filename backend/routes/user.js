// Appel des modules pour la gestion des routes utilisateurs
const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

// Routes permettant la gestion des utilisateurs
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
