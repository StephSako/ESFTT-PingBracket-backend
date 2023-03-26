const mongoose = require("mongoose");

const tableauSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    nom: String,
    format: String,
    maxNumberPlayers: String,
    poules: Boolean,
    consolante: Boolean,
    handicap: Boolean,
    age_minimum: Number,
    is_launched: Number,
    nbPoules: Number,
  },
  { _id: false }
);

module.exports = mongoose.model("Tableaux", tableauSchema, "Tableaux");
