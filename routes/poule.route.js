const express = require("express");
const router = express.Router();
const PouleController = require("../controller/PoulesController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get('/:tableau/:format', AuthMiddleware, PouleController.getPoules);

router.put('/edit/:id_poule', AuthMiddleware, PouleController.editPoule);

router.put('/generate', AuthMiddleware, PouleController.generatePoule);

router.put('/editStatus/:id_poule', AuthMiddleware, PouleController.updateStatus);

router.delete('/delete/:idTableau', AuthMiddleware, PouleController.deleteAllPoulesOfSpecificTableau);

module.exports = router;
