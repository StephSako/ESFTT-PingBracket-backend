const Pari = require("../model/Pari");
const mongoose = require("mongoose");

exports.getAll = (req, res) => {
  Pari.find()
    .then((paris) => res.status(200).json(paris))
    .catch(() =>
      res.status(500).send("Impossible de récupérer les paris des tableaux")
    );
};

exports.getAllJoueur = (req, res) => {
  Pari.findOne({ id_pronostiqueur: req.params.id_parieur })
    .then((paris) => res.status(200).json(paris))
    .catch(() =>
      res
        .status(500)
        .send(
          "Impossible de récupérer les paris du parieur " +
            req.params.id_parieur
        )
    );
};

exports.bet = (req, res) => {
  const pari = new Pari({
    _id: new mongoose.Types.ObjectId(),
    id_pronostiqueur: req.body.pari.id_pronostiqueur,
    id_prono_vainqueur: req.body.pari.id_prono_vainqueur,
    paris: req.body.pari.paris,
  });
  pari
    .save()
    .then((result) => res.status(200).json(result))
    .catch(() => res.status(500).send("Impossible de créer le pari"));
};

exports.addPariFromMatch = async (req, res) => {
  Pari.updateOne(
    { _id: req.body.pariFromMatch._id },
    {
      $push: {
        paris: {
          id_gagnant: req.body.pariFromMatch.id_gagnant,
          id_tableau: req.body.pariFromMatch.id_tableau,
          phase: req.body.pariFromMatch.phase,
          round: req.body.pariFromMatch.round,
          id_match: req.body.pariFromMatch.id_match,
        },
      },
    }
  )
    .then(() => res.status(200).json({ message: "Pari réalisé" }))
    .catch(() => res.status(500).send("Impossible de parier sur le match"));
};

exports.cancel = async (req, res) => {
  Pari.deleteOne({ _id: req.params.id_pari })
    .then(() => res.status(200).json({ message: "Pari annulé" }))
    .catch(() => res.status(500).send("Impossible d'annuler le pari"));
};

exports.deleteAll = async (req, res) => {
  Pari.deleteMany({})
    .then(() => res.status(200).json({ message: "Paris supprimés" }))
    .catch(() =>
      res.status(500).send("Impossible de supprimer tous les paris")
    );
};
