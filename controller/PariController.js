const Pari = require("../model/Pari");
const mongoose = require("mongoose");

exports.getAll = (req, res) => {
  Pari.find()
    .then((paris) => res.status(200).json(paris))
    .catch(() =>
      res.status(500).send("Impossible de récupérer les paris des tableaux")
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

//TODO
exports.update = async (req, res) => {
  let paris = await Pari.findOne();
  Pari.updateOne(
    { _id: paris._id },
    {
      $push: { paris: req.body.log },
    }
  )
    .then(() => res.status(200).json({ message: "Pari modifié" }))
    .catch(() => res.status(500).send("Impossible de modifier le pari"));
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
