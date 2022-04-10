const mongoose = require('mongoose')

const stockSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  label: String,
  stock: Number
})

module.exports = mongoose.model('Stocks', stockSchema, "Stocks")
