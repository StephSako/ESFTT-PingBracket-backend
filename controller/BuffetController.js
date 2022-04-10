const Buffet = require('../model/Buffet')

exports.getBuffet = (req, res) => {
  Buffet.findOne().then(parametres => res.status(200).json(parametres)).catch(() => res.status(500).send('Impossible de récupérer les données du buffet'))
}

exports.platsAlreadyCooked = (req, res) => {
  Buffet.findOne().then((buffet) => res.status(200).json(buffet.plats)).catch(() => res.status(500).send('Erreur lors du chargement des plats déjà cuisinés'))
}

exports.register = async (req, res) => {
  let buffet = await Buffet.findOne()
  Buffet.updateOne({ _id: buffet._id},
  {
    $push: { plats: { $each: req.body.plats } },
    $inc: {
      nb_moins_13_ans: req.body.nb_moins_13_ans,
      nb_plus_13_ans: req.body.nb_plus_13_ans
    }
  }).then((result) => res.status(200).json({message: result})).catch(() => res.status(500).send('Impossible d\'enregistrer les données du buffet'))
}
