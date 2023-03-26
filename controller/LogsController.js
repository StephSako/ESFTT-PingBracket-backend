const Logs = require("../model/Logs");

exports.getAll = (req, res) => {
  Logs.findOne()
    .then((log) => res.status(200).json(log.logs))
    .catch(() =>
      res.status(500).send("Erreur lors du chargement des logs d'inscriptions")
    );
};

exports.add = async (req, res) => {
  let logs = await Logs.findOne();
  Logs.updateOne(
    { _id: logs._id },
    {
      $push: { logs: req.body.log },
    }
  )
    .then(() => res.status(200).json({ message: "Log ajouté" }))
    .catch(() =>
      res.status(500).send("Impossible d'ajouter le log d'inscription")
    );
};

exports.empty = async (req, res) => {
  Logs.updateMany({}, { $set: { logs: [] } })
    .then(() => res.status(200).json({ message: "Logs supprimés" }))
    .catch(() =>
      res.status(500).send("Impossible d'ajouter le log d'inscription")
    );
};
