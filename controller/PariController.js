const Pari = require("../model/Pari");

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

exports.addPariFromMatch = async (req, res) => {
  Pari.updateOne(
    { _id: req.params.fiche_pari_id },
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
  Pari.updateOne(
    { _id: req.params.fiche_pari_id },
    {
      $pull: {
        paris: {
          id_tableau: req.body.pariMatch.id_tableau,
          phase: req.body.pariMatch.phase,
          round: req.body.pariMatch.round,
          id_match: req.body.pariMatch.id_match,
          id_gagnant: req.body.pariMatch.id_gagnant,
        },
      },
    }
  )
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
