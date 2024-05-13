const express = require("express");
const router = express.Router();
const ParisController = require("../controller/PariController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get("/", AuthMiddleware, ParisController.getAll);

router.get("/:id_parieur", AuthMiddleware, ParisController.getAllJoueur);

router.post(
  "/addPariFromMatch/:fiche_pari_id",
  AuthMiddleware,
  ParisController.addPariFromMatch
);

router.put("/cancel/:fiche_pari_id", AuthMiddleware, ParisController.cancel);

router.delete("/deleteAll", AuthMiddleware, ParisController.deleteAll);

module.exports = router;
