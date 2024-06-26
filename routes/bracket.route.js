const express = require("express");
const router = express.Router();
const BracketController = require("../controller/BracketController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get(
  "/:tableau/:phase/:is_pari/:id_parieur",
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

router.put(
  "/lock-paris/match/:tableau_id/:phase/:match_id/:match_round",
  AuthMiddleware,
  BracketController.lockMatchToBets
);

module.exports = router;
