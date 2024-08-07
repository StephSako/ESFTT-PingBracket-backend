const express = require("express");
const router = express.Router();
const JoueurController = require("../controller/JoueurController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get("/:id_player", AuthMiddleware, JoueurController.getPlayer);

router.get("/", AuthMiddleware, JoueurController.getAllPlayers);

router.get(
  "/subscribed/names",
  AuthMiddleware,
  JoueurController.getAllPlayersNames
);

router.get(
  "/unsubscribed/:tableau",
  AuthMiddleware,
  JoueurController.unsubscribedPlayers
);

router.get(
  "/subscribed/:tableau",
  AuthMiddleware,
  JoueurController.subscribedPlayersOfSpecificTableau
);

router.get(
  "/unassigned/:tableau",
  AuthMiddleware,
  JoueurController.unassignedPlayersBinomes
);

router.get(
  "/check/id_parieur/:id_parieur",
  AuthMiddleware,
  JoueurController.checkIdParieur
);

router.post("/create", AuthMiddleware, JoueurController.subscribePlayer);

router.put("/edit/:id_player", AuthMiddleware, JoueurController.editPlayer);

router.put(
  "/unsubscribe/:id_player/:tableau",
  AuthMiddleware,
  JoueurController.unsubscribedPlayer
);

router.delete(
  "/delete/:id_player",
  AuthMiddleware,
  JoueurController.deletePlayer
);

router.put("/move", AuthMiddleware, JoueurController.movePlayers);

router.put(
  "/pointer/:id_player",
  AuthMiddleware,
  JoueurController.pointerPlayer
);

module.exports = router;
