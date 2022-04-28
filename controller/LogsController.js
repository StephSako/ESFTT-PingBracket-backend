const Logs = require('../model/Logs')

exports.getAll = (req, res) => {
    Logs.findOne().then((log) => res.status(200).json(log.logs)).catch(() => res.status(500).send('Erreur lors du chargement des logs d\'inscriptions'))
}

exports.add = async (req, res) => {
    let logs = await Logs.findOne()
    Logs.updateOne({ _id: logs._id},
    {
        $push: { logs: req.body.log }
    }).then((result) => res.status(200).json({message: result})).catch(() => res.status(500).send('Impossible d\'ajouter le log d\'inscription'))
}
  