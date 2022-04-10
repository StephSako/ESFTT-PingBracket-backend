const mongoose = require('mongoose')

const pouleSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  objectRef: String,
  tableau: {
    type: mongoose.Types.ObjectId,
    ref: 'Tableaux'
  },
  locked: Boolean,
  participants: [{
      type: mongoose.Types.ObjectId,
      refPath: 'objectRef'
  }],
},{ _id : false })

module.exports = mongoose.model('Poules', pouleSchema, "Poules")
