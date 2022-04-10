const express = require("express");
const router = express.Router();
const BinomeController = require("../controller/BinomeController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get('/:tableau', AuthMiddleware, BinomeController.getBinomesOfSpecificTableau);

router.put('/edit/:idJoueur', AuthMiddleware, BinomeController.editBinome);

router.delete('/remove_player/:id_binome/:id_player', AuthMiddleware, BinomeController.removePlayerInBinome);

router.put('/remove_player/:id_binome/:id_player', AuthMiddleware, BinomeController.generateOfSpecificTableau);

router.delete('/reset/:tableau', AuthMiddleware, BinomeController.deleteAllBinomesOfSpecificTableau);

module.exports = router;
