const express = require("express");
const router = express.Router();
const BuffetController = require("../controller/BuffetController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get('/', AuthMiddleware, BuffetController.getBuffet);

router.get('/platsAlreadyCooked', AuthMiddleware, BuffetController.platsAlreadyCooked);

router.post('/register', AuthMiddleware, BuffetController.register);

module.exports = router;
