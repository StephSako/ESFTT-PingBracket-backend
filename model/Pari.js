const mongoose = require("mongoose");

const pariSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
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
        id_tableau: {
          type: mongoose.Types.ObjectId,
          ref: "Tableaux",
        },
        phase: String,
        id_match: Number,
        round: Number,
      },
    ],
  },
  { _id: false }
);

module.exports = mongoose.model("Paris", pariSchema, "Paris");
