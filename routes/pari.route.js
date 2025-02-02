const express = require("express");
const router = express.Router();
const ParisController = require("../controller/PariController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get("/", AuthMiddleware, ParisController.getGeneralResult);

router.get("/:id_parieur", AuthMiddleware, ParisController.getParisJoueur);

router.post(
  "/addPariFromMatch/:fiche_pari_id",
  AuthMiddleware,
  ParisController.addPariFromMatch
);

router.put("/cancel/:fiche_pari_id", AuthMiddleware, ParisController.cancel);

router.delete(
  "/delete/:id_tableau/:phase",
  AuthMiddleware,
  ParisController.deleteParisPhase
);

router.post(
  "/vainqueur/:id_tableau/:id_gagnant/:objectRef",
  AuthMiddleware,
  ParisController.parierGagnantTableau
);

module.exports = router;
