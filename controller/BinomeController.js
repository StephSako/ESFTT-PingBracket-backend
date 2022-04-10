const Binome = require('../model/Binome')
const Joueur = require('../model/Joueur')
const mongoose = require('mongoose')

exports.getBinomesOfSpecificTableau = (req, res) => {
  Binome.find({tableau: req.params.tableau}).populate('joueurs').populate('tableau').then(binomes => res.status(200).json(binomes)).catch(() => res.status(500).send('Impossible de récupérer le binôme du tableau'))
}

exports.editBinome = async (req, res) => {
  try {
    // On supprime le joueur déplacé de son ancien binôme s'il s'agit d'un échange entre deux binômes
    if (req.body.oldIdBinome) await Binome.updateOne({ _id: req.body.oldIdBinome}, {$pull: {joueurs: {$in: [req.params.idJoueur]}}})

    // On met à jour le nouveau binôme avec la liste des joueurs s'il s'agit d'un échange entre deux binômes
    if (req.body.newIdBinome) {
      await Binome.updateOne({_id: req.body.newIdBinome}, {
        $set: {
          joueurs: req.body.newPlayersList
        }
      })
    }
    res.status(200).json({message: 'La binome a été mise à jour'})
  } catch (e) {
    res.status(500).send('Impossible de modifier la binome')
  }
}

exports.removePlayerInBinome = (req, res) => {
  Binome.updateOne({ _id: req.params.id_binome}, {$pull: {joueurs: {$in: [req.params.id_player]}}}).then(() => res.json({message: "Joueur dissocié"})).catch(() => res.status(500).send('Impossible de dissocier le joueur du binôme après double-click'))
}

exports.generateOfSpecificTableau = async (req, res) => {
  try {
    let nbJoueursInscrits = await Joueur.countDocuments({tableaux : {$all: [req.params.id_tableau]}})
    if (nbJoueursInscrits % 2 !== 0){ nbJoueursInscrits += 1 }
    nbJoueursInscrits /= 2

    for (let i = 0; i < nbJoueursInscrits; i++) {
      let binome = new Binome({
        _id: new mongoose.Types.ObjectId(),
        tableau: req.params.id_tableau,
        joueurs: []
      })
      await binome.save()
    }

    res.status(200).json({message: 'OK'})
  } catch (err) {
    res.status(500).send('Impossible de générer les binômes')
  }
}

exports.deleteAllBinomesOfSpecificTableau = (req, res) => {
  Binome.deleteMany({ tableau: req.params.tableau }).then(() => res.json({message: "No error"})).catch(() => res.status(500).send('Impossible de supprimer tous les binômes'))
}
