const mongoose = require("mongoose");

const tableauSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    nom: String,
    format: String,
    maxNumberPlayers: Number,
    poules: Boolean,
    consolante: Boolean,
    handicap: Boolean,
    age_minimum: Number,
    type_licence: Number,
    is_launched: Number,
    nbPoules: Number,
    palierQualifies: Number,
    palierConsolantes: Number,
    hasChapeau: Boolean,
    pariable: Boolean,
    bracketPariable: Boolean,
    consolantePariable: Boolean,
    ptsGagnesParisVainqueur: Number,
    ptsPerdusParisVainqueur: Number,
    ptsGagnesParisWB: Number,
    ptsPerdusParisWB: Number,
    ptsGagnesParisLB: Number,
    ptsPerdusParisLB: Number,
  },
  { _id: false }
);

module.exports = mongoose.model("Tableaux", tableauSchema, "Tableaux");
