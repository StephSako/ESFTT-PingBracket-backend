const express = require("express");
const router = express.Router();
const StockController = require("../controller/StockController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get('/', AuthMiddleware, StockController.getStock);

router.post('/create', AuthMiddleware, StockController.create);

router.delete('/delete/:stock_id', AuthMiddleware, StockController.deleteStock);

router.put('/edit/:stock_id', AuthMiddleware, StockController.editStock);

module.exports = router;
