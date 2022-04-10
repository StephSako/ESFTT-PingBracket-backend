const mongoose = require('mongoose')

const tableauSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  nom: String,
  format: String,
  poules: Boolean,
  consolante: Boolean,
  age_minimum: Number,
  nbPoules: Number
},{ _id : false })

module.exports = mongoose.model('Tableaux', tableauSchema, "Tableaux")
