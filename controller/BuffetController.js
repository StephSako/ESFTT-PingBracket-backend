const Buffet = require("../model/Buffet");

exports.getBuffet = (_req, res) => {
  Buffet.findOne()
    .then((parametres) => res.status(200).json(parametres))
    .catch(() =>
      res.status(500).send("Impossible de récupérer les données du buffet")
    );
};

exports.platsAlreadyCooked = (req, res) => {
  Buffet.findOne()
    .then((buffet) => res.status(200).json(buffet.plats))
    .catch(() =>
      res.status(500).send("Erreur lors du chargement des plats déjà cuisinés")
    );
};

exports.register = (req, res) => {
  Buffet.updateOne(
    {},
    {
      $push: { plats: { $each: req.body.plats } },
      $inc: {
        enfant: req.body.enfant,
        ado_adulte: req.body.ado_adulte,
      },
    }
  )
    .then(() => res.status(200).json({ message: "Buffet enregistré" }))
    .catch(() =>
      res.status(500).send("Impossible d'enregistrer les données du buffet")
    );
};

exports.edit = async (req, res) => {
  const buffet = {
    enfant: req.body.enfant,
    ado_adulte: req.body.ado_adulte,
    plats: req.body.plats,
  };
  Buffet.updateOne({}, { $set: buffet })
    .then(() => res.status(200).json({ message: "Buffet modifié" }))
    .catch(() => res.status(500).send("Impossible de modifier le buffet"));
};
