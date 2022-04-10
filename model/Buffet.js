const mongoose = require('mongoose')

const buffetSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  nb_moins_13_ans: Number,
  nb_plus_13_ans: Number,
  plats: [String]
})

module.exports = mongoose.model('Buffets', buffetSchema, "Buffets")
