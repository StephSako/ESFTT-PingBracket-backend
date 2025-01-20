const mongoose = require("mongoose");

const pariSchema = mongoose.Schema(
  {
    _id: mongoose.Types.ObjectId,
    id_pronostiqueur: {
      type: mongoose.Types.ObjectId,
      ref: "Joueurs",
    },
    pronos_vainqueurs: [
      {
        objectRef: String,
        id_gagnant: {
          type: mongoose.Types.ObjectId,
          refPath: "pronos_vainqueurs.objectRef",
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
