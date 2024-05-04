const mongoose = require("mongoose");

const pariSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    tableau: {
      type: mongoose.Types.ObjectId,
      ref: "Tableaux",
    },
    id_pronostiqueur: {
      type: mongoose.Types.ObjectId,
      ref: "Joueurs",
    },
    id_prono_vainqueur: {
      type: mongoose.Types.ObjectId,
      ref: "Joueurs",
    },
    paris: [
      {
        id_gagnant: {
          type: mongoose.Types.ObjectId,
          ref: "Joueurs",
        },
        id_bracket: {
          type: mongoose.Types.ObjectId,
          ref: "Brackets",
        },
        id_match: Number,
        round: Number,
      },
    ],
  },
  { _id: false }
);

module.exports = mongoose.model("Paris", pariSchema, "Paris");
