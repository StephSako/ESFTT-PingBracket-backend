const Account = require('../model/Account')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

exports.login = (req, res) => {
  Account.findOne({ username: req.body.username }).then(account => {
    // console.log( bcrypt.hashSync(req.body.password, 12))
    if (bcrypt.compareSync(req.body.password, account.password)) {
      let token = jwt.sign(account.toJSON(), process.env.APP_SECRET, {
        expiresIn: '7d'
      })
      res.json({ token: token })
    } else res.status(500).send("Le mot de passe est incorrect")
  }).catch(() => res.status(500).send('Ce pseudo n\'existe pas'))
}

exports.editUsername = (req, res) => {
  Account.findByIdAndUpdate({_id: req.body._id}, {username: req.body.username}, {new: true, useFindAndModify: false}).then(result => {
    let token = jwt.sign(result.toJSON(), process.env.APP_SECRET, {
      expiresIn: '365d'
    })
    res.json({token: token})
  }).catch(() => res.status(500).send('Impossible de modifier l\'username du compte'))
}

exports.editPassword = (req, res) => {
  Account.findOne({ _id: req.body._id }).then(account => {
    if (bcrypt.compareSync(req.body.actualPassword, account.password)) {
      Account.findByIdAndUpdate({_id: req.body._id}, {password: bcrypt.hashSync(req.body.newPassword, 12)}, {new: true, useFindAndModify: false}).then(result => {
        let token = jwt.sign(result.toJSON(), process.env.APP_SECRET, {
          expiresIn: '1d'
        })
        res.json({token: token})
      }).catch(() => res.status(500).send('Impossible de modifier le mot de passe du compte'))
    } else res.status(500).send("Le mot de passe actuel saisi est incorrect")
  }).catch(() => res.status(500).send('Le compte est introuvable'))
}
