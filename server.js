const compression = require("compression");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const session = require("cookie-session");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to mongodb.."))
  .catch((e) => console.log("could not connect to mongodb", e));

app.use(
  session({
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
app.use(compression());

app.use(function (_req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const path = require("path");
app.use(express.static(path.join(__dirname, "dist/")));

app.get("/api", function (_req, res) {
  res.json({ status: "Working" });
});

let BracketRoute = require("./routes/bracket.route");
app.use("/api/bracket", BracketRoute);

let JoueurRoute = require("./routes/joueur.route");
app.use("/api/joueur", JoueurRoute);

let PoulesRoute = require("./routes/poule.route");
app.use("/api/poule", PoulesRoute);

let TableauRoute = require("./routes/tableau.route");
app.use("/api/tableau", TableauRoute);

let AccountRoute = require("./routes/account.route");
app.use("/api/account", AccountRoute);

let ParametreRoute = require("./routes/parametre.route");
app.use("/api/parametre", ParametreRoute);

let BuffetRoute = require("./routes/buffet.route");
app.use("/api/buffet", BuffetRoute);

let BinomeRoute = require("./routes/binome.route");
app.use("/api/binome", BinomeRoute);

let StockRoute = require("./routes/stock.route");
app.use("/api/stock", StockRoute);

let LogsRoute = require("./routes/logs.route");
app.use("/api/logs", LogsRoute);

let ParisRoute = require("./routes/pari.route");
app.use("/api/paris", ParisRoute);

let port = process.env.PORT || 3000;
let ip = process.env.IP || "0.0.0.0";
app.listen(port, ip, function () {
  console.log("Express server listening on port " + port + " on IP " + ip);
});
