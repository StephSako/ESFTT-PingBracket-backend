const mongoose = require('mongoose')

const binomeSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  tableau: {
    type: mongoose.Types.ObjectId,
    ref: 'Tableaux'
  },
  joueurs: [{
    type: mongoose.Types.ObjectId,
    ref: 'Joueurs'
  }],
},{ _id : false })

module.exports = mongoose.model('Binomes', binomeSchema, "Binomes")
