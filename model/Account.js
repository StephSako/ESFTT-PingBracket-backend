const mongoose = require('mongoose')

const accountSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  username: String,
  password: String,
})

module.exports = mongoose.model('Accounts', accountSchema, "Accounts")
