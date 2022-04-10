const express = require("express");
const router = express.Router();
const ParametreController = require("../controller/ParametreController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get("/", AuthMiddleware, ParametreController.get);

router.put('/edit/:id_parametres', AuthMiddleware, ParametreController.edit);

router.put('/change_form_state/:id_parametres', AuthMiddleware, ParametreController.editStatus);

module.exports = router;
