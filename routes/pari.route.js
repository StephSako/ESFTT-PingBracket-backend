const express = require("express");
const router = express.Router();
const ParisController = require("../controller/PariController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get("/", AuthMiddleware, ParisController.getAll);

router.get("/:id_parieur", AuthMiddleware, ParisController.getAllJoueur);

router.post("/create", AuthMiddleware, ParisController.bet);

router.post(
  "/addPariFromMatch",
  AuthMiddleware,
  ParisController.addPariFromMatch
);

router.delete("/cancel/:id_pari", AuthMiddleware, ParisController.cancel);

router.delete("/deleteAll", AuthMiddleware, ParisController.deleteAll);

module.exports = router;
