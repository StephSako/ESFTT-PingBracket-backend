const express = require("express");
const router = express.Router();
const BracketController = require("../controller/BracketController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get(
  "/:tableau/:phase",
  AuthMiddleware,
  BracketController.bracketOfSpecificTableau
);

router.put(
  "/edit/:tableau/:phase/:id_round/:id_match",
  AuthMiddleware,
  BracketController.setWinner
);

router.put(
  "/generate/:tableau/:phase",
  AuthMiddleware,
  BracketController.generateBracket
);

router.delete(
  "/delete/:idTableau",
  AuthMiddleware,
  BracketController.deleteBracket_s
);

router.put(
  "/cancel/match/result/:tableau_id/:phase/:match_id/:match_round/:winner_id/:looser_id",
  AuthMiddleware,
  BracketController.cancelMatchResult
);

module.exports = router;
