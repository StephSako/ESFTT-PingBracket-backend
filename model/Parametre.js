const mongoose = require("mongoose");

const parametreSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  date: Date,
  titre: String,
  texte_debut: String,
  texte_buffet: String,
  texte_fin: String,
  texte_contact: String,
  consignes_tableaux: String,
  open: Boolean,
});

module.exports = mongoose.model("Parametres", parametreSchema, "Parametres");
