const express = require("express");
const router = express.Router();
const ParisController = require("../controller/PariController");
const AuthMiddleware = require("../middleware/auth-middleware");

router.get("/", AuthMiddleware, ParisController.getAll);

router.post("/create", AuthMiddleware, ParisController.bet);

router.put("/update", AuthMiddleware, ParisController.update);

router.delete("/cancel/:id_pari", AuthMiddleware, ParisController.cancel);

router.delete("/deleteAll", AuthMiddleware, ParisController.deleteAll);

module.exports = router;
