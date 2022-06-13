const Poule = require('../model/Poule')
const Binome = require('../model/Binome')
const Joueur = require('../model/Joueur')
const mongoose = require('mongoose')
const helper = require('./Helper');

exports.getPoules = (req, res) => {
  if (req.params.format === 'simple') Poule.find({tableau: req.params.tableau}).populate('participants').then(poules => res.status(200).json(poules)).catch(() => res.status(500).send('Impossible de récupérer la poule après modification'))
  else if (req.params.format === 'double') Poule.find({tableau: req.params.tableau}).populate('participants').populate({path: 'participants', populate: { path: 'joueurs' }}).then(poules => res.status(200).json(poules)).catch(() => res.status(500).send('Impossible de récupérer la poule après modification'))
}

exports.editPoule = (req, res) => {
  Poule.updateOne({_id: req.params.id_poule}, {
    $set: {
      participants: req.body
    }
  }).then(() => res.json({message: "La poule a été mise à jour"})).catch(() => res.status(500).send('Impossible de modifier la poule'))
}

exports.generatePoule = async (req, res) => {
  try {
    let poules = []
    for (let i = 0; i < req.body.nbPoules; i++){
      poules.push([])
    }

    let participants = [];
    if (req.body.format === 'simple') participants = await Joueur.find({ tableaux : {$all: [req.body._id]}}).sort({classement: 'desc', nom: 'asc'})
    else if (req.body.format === 'double'){
      participants = await Binome.find({ tableau : req.body._id}).populate('joueurs')
      participants = participants.filter(binome => binome.joueurs.length >= 2 && binome.joueurs.length <= req.body.maxNumberPlayers)

      // On ordonne les binômes selon les sommes décroissantes des classements des joueurs le composant, sinon dans l'ordre alphabétique croissant
      let sortedArray = participants.sort((binome1, binome2) => {
          let addClassement = (a, b) => a + b.classement
          if (binome1.joueurs.reduce(addClassement, 0) === binome2.joueurs.reduce(addClassement, 0)){
            return -(binome1.joueurs.sort((a, b) => a.nom.localeCompare(b.nom))[0].nom).localeCompare(binome2.joueurs.sort((a, b) => a.nom.localeCompare(b.nom))[0].nom)
          }
          return binome1.joueurs.reduce(addClassement, 0) - binome2.joueurs.reduce(addClassement, 0)
      })
      participants = sortedArray.reverse()
    }
    await Poule.deleteMany({ tableau: req.body._id})

    // Formation des poules
    let j = 0
    let mode = 0 // 0 = on monte, 1 = on descend
    let double = false
    for (let i = 0; i < participants.length; i++){
      poules[j].push(participants[i]._id)

      if (mode === 0){
        if (j === (poules.length-1)){
          if (double){
            mode = 1
            j--
            double = false
          }
          else double = true
        }
        else j++
      } else {
        if (j === 0){
          if (double) {
            mode = 0
            j++
            double = false
          }
          else double = true
        }
        else j--
      }
    }

    // Formation des documents
    for (let i = 0; i < poules.length; i++){
      let poule = new Poule({
        _id: new mongoose.Types.ObjectId(),
        tableau: req.body._id,
        objectRef: (req.body.format === 'double' ? 'Binomes' : 'Joueurs'),
        locked: false,
        participants: poules[i]
      })
      await poule.save()
    }
    res.status(200).json({message: 'No error'})
  }
  catch (err) {
    res.status(500).send('Impossible de générer la poule')
  }
}

exports.updateStatus = (req, res) => {
  Poule.updateOne({_id: req.params.id_poule}, {
    $set: {
      locked: req.body.locked
    }
  }).then(() => res.json({message: "Le status de la poule a été mis à jour"})).catch(() => res.status(500).send('Impossible de modifier le statut de la poule'))
}

exports.deleteAllPoulesOfSpecificTableau = (req, res) => {
  Poule.deleteMany({tableau: req.params.idTableau}).then(() => res.status(200).json({message: 'Poules supprimées'})).catch(() => res.status(500).send('Impossible de supprimer les poules demandées'))
}

exports.validateAllPoules = (req, res) => {
  Poule.updateMany({tableau: req.params.id_tableau}, {
    $set: {
      locked: true
    }
  }).then(() => res.json({message: "Toutes les poules ont été validées"})).catch(() => res.status(500).send('Impossible de valider toutes les poules'))
}