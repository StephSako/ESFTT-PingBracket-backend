const express = require("express");
const router = express.Router();
const BracketController = require("../controller/BracketController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get('/:tableau/:phase', AuthMiddleware, BracketController.poulesOfSpecificTableau);

router.put('/edit/:tableau/:phase/:id_round/:id_match', AuthMiddleware, BracketController.setWinner);

router.put('/generate/:tableau/:phase', AuthMiddleware, BracketController.generateBracket);

router.delete('/delete/:idTableau', AuthMiddleware, BracketController.deleteBracket_s);

module.exports = router;
