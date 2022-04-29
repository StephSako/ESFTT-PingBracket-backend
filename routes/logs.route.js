const express = require("express");
const router = express.Router();
const LogsController = require("../controller/LogsController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get('/', AuthMiddleware, LogsController.getAll);

router.put('/add', AuthMiddleware, LogsController.add);

router.post('/empty', AuthMiddleware, LogsController.empty);

module.exports = router;
