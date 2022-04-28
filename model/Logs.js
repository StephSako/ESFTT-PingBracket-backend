const mongoose = require('mongoose')

const logsSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  logs: {
    type: [String]
  }
})

module.exports = mongoose.model('Logs', logsSchema, "Logs")
