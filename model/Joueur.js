const mongoose = require('mongoose')

const joueurSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  classement: Number,
  nom: String,
  age: Number,
  tableaux: [{
      type: mongoose.Types.ObjectId,
      ref: 'Tableaux'
  }]
},{ _id : false })

module.exports = mongoose.model('Joueurs', joueurSchema, "Joueurs")
