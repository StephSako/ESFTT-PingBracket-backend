const mongoose = require('mongoose')

const buffetSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  enfant: Number,
  ado_adulte: Number,
  plats: [String]
})

module.exports = mongoose.model('Buffets', buffetSchema, "Buffets")
