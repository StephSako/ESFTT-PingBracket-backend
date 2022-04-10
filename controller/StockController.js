const Stock = require('../model/Stock')
const mongoose = require('mongoose')

exports.getStock = (req, res) => {
  Stock.find().then(stocks => res.status(200).json(stocks)).catch(() => res.status(500).send('Impossible de récupérer le stock'))
}

exports.create = (req, res) => {
  const stock = new Stock({
    _id: new mongoose.Types.ObjectId(),
    label: req.body.stock.label,
    stock: req.body.stock.stock
  })
  stock.save().then(() => res.status(200).json({message: 'Nouveau matériel ajouté'})).catch(() => res.status(500).send('Impossible de créer le nouveau matériel'))
}

exports.deleteStock = (req, res) => {
  Stock.deleteOne({_id: req.params.stock_id}).then(() => res.status(200).json({message: 'Matériel supprimé'})).catch(() => res.status(500).send('Impossible de supprimer le matériel demandé'))
}

exports.editStock = (req, res) => {
  Stock.updateOne({_id: req.params.stock_id}, {$set: req.body.stock}).then(() => res.status(200).json({message: 'Matériel modifié'})).catch(() => res.status(500).send('Erreur lors de la modification du stock'))
}
