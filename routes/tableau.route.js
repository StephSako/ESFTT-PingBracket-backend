const express = require("express");
const router = express.Router();
const TableauController = require("../controller/TableauController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get("/", AuthMiddleware, TableauController.getTableaux);

router.get(
  "/player_count",
  AuthMiddleware,
  TableauController.playerCountPerTableau
);

router.get(
  "/hostable/:tableauToHostId/:ageMinimum/:format/:poules",
  AuthMiddleware,
  TableauController.hostableTableaux
);

router.get("/pariables", AuthMiddleware, TableauController.pariablesTableaux);

router.get("/:tableau", AuthMiddleware, TableauController.getSpecific);

router.post("/create", AuthMiddleware, TableauController.createTableau);

router.put("/edit/:id_tableau", AuthMiddleware, TableauController.editTableau);

router.put(
  "/change_launch_state/:id_tableau",
  AuthMiddleware,
  TableauController.changeLaunchState
);

router.put(
  "/unsubscribe/invalid/:id_tableau",
  AuthMiddleware,
  TableauController.unsubscribeInvalidPlayers
);

router.delete("/reset", AuthMiddleware, TableauController.resetTournament);

router.delete(
  "/delete/:tableau_id/:format/:poules/:pariable/:consolantePariable",
  AuthMiddleware,
  TableauController.deleteTableau
);

router.put(
  "/unsubscribe_all",
  AuthMiddleware,
  TableauController.unsubscribeAllPlayers
);

module.exports = router;
