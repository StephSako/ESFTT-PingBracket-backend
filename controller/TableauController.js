const Tableau = require('../model/Tableau')
const Joueur = require('../model/Joueur')
const Poule = require('../model/Poule')
const Bracket = require('../model/Bracket')
const Binomes = require('../model/Binome')
const Logs = require('../model/Logs')
const Buffet = require('../model/Buffet')
const mongoose = require('mongoose')
const _ = require('lodash');

exports.getTableaux = (_req, res) => {
  Tableau.find().sort({nom: 'asc', age_minimum: 'asc'}).then(tableaux => res.status(200).json(tableaux)).catch(() => res.status(500).send('Impossible de récupérer tous les tableaux'))
}

exports.playerCountPerTableau = (_req, res) => {
  Joueur.aggregate([
    { $project: { tableaux: 1 } },
    { $unwind: '$tableaux' },
    { $group: { _id: '$tableaux', count: { $sum: 1 } } }
  ]).then(counts => res.status(200).json(_.chain(counts).keyBy('_id').mapValues('count').value())).catch(() => res.status(500).send('Impossible de récupérer les nombre de joueurs par tableau'))
}

exports.hostableTableaux = (req, res) => {
  Tableau.find({age_minimum: { $gte: req.params.ageMinimum}, poules: req.params.poules, format: req.params.format, _id: {$ne: req.params.tableauToHostId } }).sort({nom: 'asc'}).then(tableaux => res.status(200).json(tableaux)).catch(() => res.status(500).send('Impossible de récupérer les tableaux hébergeables de joueurs'))
}

exports.getSpecific = (req, res) => {
  Tableau.findById(req.params.tableau).then(tableau => res.status(200).json(tableau)).catch(() => res.status(500).send('Impossible de récupérer le tableau'))
}

exports.createTableau = (req, res) => {
  const tableau = new Tableau({
    _id: new mongoose.Types.ObjectId(),
    nom: req.body.nom.toLowerCase(),
    format: req.body.format,
    poules: req.body.poules,
    consolante: req.body.consolante,
    maxNumberPlayers: req.body.maxNumberPlayers,
    age_minimum: req.body.age_minimum,
    is_launched: 0, // 0 = initialisé, 1 = en cours, 2 = terminé
    nbPoules: req.body.nbPoules
  })
  tableau.save().then(result => res.status(200).json({message: result})).catch(() => res.status(500).send('Impossible de créer le tableau'))
}

exports.editTableau = (req, res) => {
  Tableau.updateOne({_id: req.params.id_tableau}, {$set: req.body}).then(result => res.status(200).json({message: result})).catch(() => res.status(500).send('Impossible de modifier le tableau'))
}

exports.unsubscribeInvalidPlayers = (req, res) => {
  Joueur.updateMany({age: { $gte: req.body.age_minimum } }, {$pull: {tableaux: {$in: [req.params.id_tableau]}}}).then(result => res.status(200).json({message: result})).catch(() => res.status(500).send('Impossible de désinscrire les joueurs invalides'))
}

exports.resetTournament = async (_req, res) => {
  try {
    await Logs.updateMany({}, { $set: { logs: [] } })
    await Bracket.deleteMany({})
    await Poule.deleteMany({})
    await Binomes.deleteMany({})
    await Buffet.updateMany({}, { $set: { enfant: 0, ado_adulte: 0, plats: [] } })
    await Tableau.updateMany({}, { $set: { is_launched: 0 } })
    await Joueur.deleteMany({})
    res.status(200).json({message: 'Tournoi remis à zéro'})
  } catch (e){
    res.status(500).send('Impossible de réinitiliaser le tournoi')
  }
}

exports.deleteTableau = async (req, res) => {
  try {
    await Bracket.deleteMany({tableau: req.params.tableau_id})
    if (req.params.poules) await Poule.deleteMany({tableau: req.params.tableau_id})
    if (req.params.format === 'double') await Binomes.deleteMany({tableau: req.params.tableau_id})
    await Joueur.updateMany({}, {$pull: {tableaux: {$in: [req.params.tableau_id]}}})
    await Tableau.deleteOne({_id: req.params.tableau_id})
    res.status(200).json({message: 'Tableau supprimé'})
  } catch (e){
    res.status(500).send('Impossible de supprimer le tableau demandé')
  }
}

exports.unsubscribeAllPlayers = async (req, res) => {
  await Bracket.deleteMany({tableau: req.body.tableau_id})
  Joueur.updateMany({}, {$pull: {tableaux: {$in: [req.body.tableau_id]}}}).then(() => res.status(200).json({message: 'No error'})).catch(() => res.status(500).send('Impossible de désinscrire tous les joueurs du tableau'))
}

exports.changeLaunchState = (req, res) => {
  Tableau.updateOne({_id: req.params.id_tableau}, {$set: { is_launched : req.body.is_launched } }).then(() => res.status(200).json({message: 'Le tableau ' + (req.body.is_launched === 0 ? 'a été lancé' : 'est terminé')})).catch(() => res.status(500).send('Impossible de changer l\'état du tableau'))
}