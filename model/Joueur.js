const mongoose = require('mongoose')

const joueurSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  classement: Number,
  pointage: Boolean,
  nom: String,
  age: Number,
  buffet: Boolean,
  tableaux: [{
      type: mongoose.Types.ObjectId,
      ref: 'Tableaux'
  }]
},{ _id : false })

module.exports = mongoose.model('Joueurs', joueurSchema, "Joueurs")
