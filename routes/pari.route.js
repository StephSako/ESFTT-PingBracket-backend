const express = require("express");
const router = express.Router();
const ParisController = require("../controller/PariController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get("/", AuthMiddleware, ParisController.getAll);

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

router.post("/vainqueur", AuthMiddleware, ParisController.parierGagnantTableau);

module.exports = router;
