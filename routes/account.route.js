const express = require("express");
const router = express.Router();
const AccountController = require("../controller/AccountController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.post('/login', AuthMiddleware, AccountController.login);

router.put('/edit/username', AuthMiddleware, AccountController.editUsername);

router.put('/edit/password', AuthMiddleware, AccountController.editPassword);

module.exports = router;
