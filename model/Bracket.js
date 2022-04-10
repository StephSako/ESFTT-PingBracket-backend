const mongoose = require('mongoose')

const bracketSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  type: String,
  phase: String,
  objectRef: String,
  tableau: {
    type: mongoose.Types.ObjectId,
    ref: 'Tableaux'
  },
  round: Number,
  matches: [{
    id: Number,
    round: Number,
    joueurs: [{
      _id: {
        type: mongoose.Types.ObjectId,
        refPath: 'objectRef'
      },
      winner: Boolean
    }]
  }]
},{ _id : false })

module.exports = mongoose.model('Brackets', bracketSchema, 'Brackets')
