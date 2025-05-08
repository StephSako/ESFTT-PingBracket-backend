const Pari = require("../model/Pari");
const Bracket = require("../model/Bracket");

exports.getGeneralResult = async (_req, res) => {
  try {
    let brackets = await Bracket.find()
      .populate({
        path: "matches.joueurs._id",
        populate: { path: "joueurs" },
      })
      .populate("tableau");

    brackets = brackets.filter(
      (bracket) => bracket.tableau.pariable && bracket.tableau.is_launched >= 1
    );

    let parisJoueurs = await Pari.find()
      .populate({
        path: "pronos_vainqueurs.id_gagnant",
        populate: { path: "pronos_vainqueurs" },
        select: "_id nom objectRef",
      })
      .populate("id_pronostiqueur", "_id nom")
      .populate({
        path: "paris.id_gagnant",
        populate: { path: "paris" },
        select: "_id nom",
      })
      .populate({
        path: "paris.id_tableau",
        populate: { path: "paris" },
        select: "_id nom format",
      })
      .populate({
        path: "pronos_vainqueurs.id_tableau",
        populate: { path: "pronos_vainqueurs" },
        select: "_id nom format",
      });

    res.status(200).json({ brackets: brackets, parisJoueurs: parisJoueurs });
  } catch (e) {
    res.status(500).send("Impossible de générer les classements des paris");
  }
};

exports.getParisJoueur = (req, res) => {
  Pari.findOne({ id_pronostiqueur: req.params.id_parieur })
    .populate({
      path: "pronos_vainqueurs.id_gagnant",
      populate: { path: "pronos_vainqueurs" },
      select: "_id nom",
    })
    .populate("id_pronostiqueur", "_id nom")
    .populate({
      path: "paris.id_gagnant",
      populate: { path: "paris" },
      select: "_id nom",
    })
    .populate({
      path: "paris.id_tableau",
      populate: { path: "paris" },
      select: "_id nom format",
    })
    .populate({
      path: "pronos_vainqueurs.id_tableau",
      populate: { path: "pronos_vainqueurs" },
      select: "_id nom format",
    })
    .then((paris) => res.status(200).json(paris))
    .catch(() =>
      res
        .status(500)
        .send(
          "Impossible de récupérer les paris du joueur " + req.params.id_parieur
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

exports.deleteParisPhase = (req, res) => {
  /**
   * all : vainqueur + finale + consolante
   * all_brackets : finale + consolante
   * consolante : consolante
   */
  let filter = {};

  switch (req.params.phase) {
    case "all":
      filter = {
        paris: {
          id_tableau: req.params.id_tableau,
        },
        pronos_vainqueurs: {
          id_tableau: req.params.id_tableau,
        },
      };
      break;
    case "all_brackets":
      filter = {
        paris: {
          id_tableau: req.params.id_tableau,
        },
      };
      break;
    case "consolante":
      filter = {
        paris: {
          id_tableau: req.params.id_tableau,
          phase: req.params.phase,
        },
      };
      break;
  }

  Pari.updateMany(
    {},
    {
      $pull: filter,
    }
  )
    .then(() =>
      res.status(200).json({
        message:
          "Paris supprimés du tableau '" +
          req.params.id_tableau +
          "' pour '" +
          req.params.phase +
          "'",
      })
    )
    .catch(() =>
      res
        .status(500)
        .send(
          "Impossible de supprimer les paris du tableau '" +
            req.params.id_tableau +
            "' pour '" +
            req.params.phase +
            "'"
        )
    );
};

exports.parierGagnantTableau = async (req, res) => {
  try {
    if (req.body.creation_prono_vainqueur) {
      await Pari.updateOne(
        { id_pronostiqueur: req.body.id_parieur },
        {
          $push: {
            pronos_vainqueurs: {
              id_tableau: req.params.id_tableau,
              id_gagnant: req.params.id_gagnant,
              objectRef: req.params.objectRef,
            },
          },
        }
      );
    } else {
      await Pari.updateOne(
        { id_pronostiqueur: req.body.id_parieur },
        {
          $set: {
            "pronos_vainqueurs.$[tableau].id_gagnant": req.params.id_gagnant,
          },
        },
        {
          arrayFilters: [{ "tableau.id_tableau": req.params.id_tableau }],
        }
      );
    }

    res.status(200).json({ message: "Vainqueur du tableau défini" });
  } catch (e) {
    res.status(500).send("Impossible de définir le vainqueur du tableau");
  }
};
