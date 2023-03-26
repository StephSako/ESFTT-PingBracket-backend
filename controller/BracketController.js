const Bracket = require("../model/Bracket");
const Binome = require("../model/Binome");
const Poule = require("../model/Poule");
const mongoose = require("mongoose");
const helper = require("./Helper");

const NB_MATCHES_ROUND = { 7: 64, 6: 32, 5: 16, 4: 8, 3: 4, 2: 2, 1: 2 };
const ORDRE_SOIXANTEQUATRIEME = [
  1, 128, 65, 64, 3, 96, 97, 32, 17, 112, 81, 48, 49, 80, 113, 16, 9, 120, 73,
  56, 41, 88, 105, 24, 25, 104, 89, 40, 57, 72, 121, 8, 5, 124, 69, 60, 37, 92,
  101, 28, 21, 108, 85, 44, 53, 76, 117, 12, 13, 116, 77, 52, 45, 84, 109, 20,
  29, 100, 93, 36, 61, 68, 125, 4, 3, 126, 67, 62, 35, 94, 99, 30, 19, 110, 83,
  46, 51, 78, 115, 14, 11, 118, 75, 54, 3, 86, 107, 22, 27, 102, 91, 38, 59, 70,
  123, 6, 7, 122, 71, 58, 39, 90, 103, 26, 23, 106, 87, 42, 55, 74, 119, 10, 15,
  114, 79, 50, 47, 82, 111, 18, 31, 98, 95, 34, 63, 66, 127, 2,
];
const ORDRE_TRENTEDEUXIEME = [
  1, 64, 33, 32, 17, 48, 49, 16, 9, 56, 41, 24, 25, 40, 57, 8, 5, 60, 37, 28,
  21, 44, 53, 12, 13, 52, 45, 20, 29, 36, 61, 4, 3, 62, 35, 30, 19, 46, 51, 14,
  11, 54, 43, 22, 27, 38, 59, 6, 7, 58, 39, 26, 23, 42, 55, 10, 15, 50, 47, 18,
  31, 34, 63, 2,
];
const ORDRE_SEIZIEME = [
  1, 32, 17, 16, 9, 24, 25, 8, 5, 28, 21, 12, 13, 20, 29, 4, 3, 30, 19, 14, 11,
  22, 27, 6, 7, 26, 23, 10, 15, 18, 31, 2,
];
const ORDRE_HUITIEME = [1, 16, 9, 8, 5, 12, 13, 4, 3, 14, 11, 6, 7, 10, 15, 2];
const ORDRE_QUART = [1, 8, 5, 4, 3, 6, 7, 2];
const ORDRE_DEMI = [1, 4, 3, 2];
const ORDRE_FINALE = [1, 2];

const NB_PARTICIPANTS_PHASES_FINALES = {
  finale: {
    premier: 0,
    deuxieme: 2,
  },
  consolante: {
    premier: 2,
    deuxieme: 4,
  },
  consolante_bis: {
    premier: 4,
    deuxieme: 6,
  },
};

// Push player into a specific match
async function setPlayerSpecificMatch(
  id_round,
  id_match,
  id_player,
  tableau,
  phase
) {
  await Bracket.updateOne(
    {
      round: id_round,
      tableau: tableau,
      phase: phase,
      "matches.id": id_match,
    },
    {
      $push: {
        "matches.$[match].joueurs": {
          _id: id_player,
          winner: false,
        },
      },
    },
    {
      arrayFilters: [{ "match.id": id_match }],
    }
  );
}

async function defineMatchStatusAndWinner(
  id_round,
  tableau,
  phase,
  id_match,
  winner_id
) {
  // On définie :
  // - le joueur cliqué comme gagnant
  // - le match comme "terminé"
  await Bracket.updateOne(
    {
      round: id_round,
      tableau: tableau,
      phase: phase,
      "matches.id": id_match,
    },
    {
      $set: {
        "matches.$[match].joueurs.$[joueur].winner": true,
      },
    },
    {
      arrayFilters: [{ "match.id": id_match }, { "joueur._id": winner_id }],
    }
  );

  // Pour tous les matches sauf la finale, le gagnant évolue au prochain match
  if (Number(id_round) !== 1) {
    // On définie :
    // - le joueur gagnant dans le prochain match
    // - les perdants des demies vont en match pour la 3ème place

    let idNextMatch = id_match;
    if (idNextMatch % 2 !== 0) idNextMatch++;
    idNextMatch = idNextMatch / 2;
    let idNextRound = id_round;
    idNextRound--;
    await setPlayerSpecificMatch(
      idNextRound,
      idNextMatch,
      winner_id,
      tableau,
      phase
    );
  }
}

exports.bracketOfSpecificTableau = (req, res) => {
  Bracket.find({ tableau: req.params.tableau, phase: req.params.phase })
    .populate("tableau")
    .populate({
      path: "matches.joueurs._id",
      populate: { path: "joueurs" },
    })
    .sort({ round: "desc" })
    .then((matches) => res.status(200).json({ rounds: matches }))
    .catch(() => res.status(500).send("Impossible de récupérer le bracket"));
};

exports.setWinner = async (req, res) => {
  try {
    await defineMatchStatusAndWinner(
      req.params.id_round,
      req.params.tableau,
      req.params.phase,
      req.params.id_match,
      req.body.winnerId
    );

    // S'il s'agit des demies-finale, on assigne les perdants en petite finale
    if (Number(req.params.id_round) === 2 && req.body.looserId) {
      await setPlayerSpecificMatch(
        1,
        2,
        req.body.looserId,
        req.params.tableau,
        req.params.phase
      );
    }
    res.status(200).json({ message: "OK" });
  } catch (err) {
    res.status(500).send("Impossible d'assigner le gagnant");
  }
};

exports.generateBracket = async (req, res) => {
  try {
    let listPerdants = [];
    // On repêche les perdants seulement pour la consolante et la consolante-bis
    let parentPhase =
      req.params.phase === "consolante_bis"
        ? "consolante"
        : req.params.phase === "consolante"
        ? "finale"
        : null;
    if (parentPhase !== null) {
      await Bracket.find({ tableau: req.params.tableau, phase: "finale" })
        .sort({ round: -1 })
        .populate({
          path: "matches.joueurs._id",
          populate: { path: "joueurs" },
        })
        .limit(1)
        .then((res) => {
          if (res.length > 0) {
            // Liste des matches du premier round ayant été joués
            let matchesFirstRoundPlayed = res[0].matches;
            matchesFirstRoundPlayed = matchesFirstRoundPlayed.filter(
              (match) => {
                let resultats = match.joueurs.map((joueur) => joueur.winner);
                return !resultats.every((v) => v === resultats[0]);
              }
            );

            // On prend que les joueurs ayant perdus leurs rencontres
            listPerdants = matchesFirstRoundPlayed
              .map((match) => match.joueurs)
              .map((joueurs) => {
                return joueurs.filter((joueur) => !joueur.winner);
              })
              .flat()
              .map((perdant) => perdant._id);

            // On classe selon leurs classements
            listPerdants.sort((j1, j2) => {
              return j2.classement - j1.classement;
            });
            listPerdants = listPerdants.map((joueur) => joueur._id);
          }
        });
    }

    // On supprime tous les matches
    await Bracket.deleteMany({
      tableau: req.params.tableau,
      phase: req.params.phase,
    });

    let poules;
    if (req.body.format === "double") {
      if (req.body.poules) {
        poules = await Poule.find({ tableau: req.params.tableau }).populate(
          "participants"
        );
        poules.forEach((poule) => {
          poule.participants = poule.participants.filter(
            (participant) =>
              participant.joueurs.length >= 2 &&
              participant.joueurs.length <= parseInt(req.body.maxNumberPlayers)
          );
        });
      } else {
        poules = await Binome.find({ tableau: req.params.tableau });
        poules = poules.filter(
          (binome) =>
            binome.joueurs.length >= 2 &&
            binome.joueurs.length <= parseInt(req.body.maxNumberPlayers)
        );
      }
    } else if (req.body.format === "simple") {
      if (req.body.poules)
        poules = await Poule.find({ tableau: req.params.tableau });
      else
        res
          .status(500)
          .send(
            "Impossible de créer de tableau au format 'simple' sans poules."
          );
    }

    // On calcule combien de rounds sont nécessaires en fonction du nombre de joueurs/binômes qualifiés si le tableau a des poules
    let nbQualified = 0,
      nbRounds,
      rankOrderer;
    if (req.body.poules)
      poules.forEach(
        (poule) =>
          (nbQualified += poule.participants.slice(
            NB_PARTICIPANTS_PHASES_FINALES[req.params.phase].premier,
            NB_PARTICIPANTS_PHASES_FINALES[req.params.phase].deuxieme
          ).length)
      );
    else nbQualified = poules.length;
    nbQualified += listPerdants.length;

    if (nbQualified > 64) {
      nbRounds = 7;
      rankOrderer = ORDRE_SOIXANTEQUATRIEME;
    } else if (nbQualified > 32) {
      nbRounds = 6;
      rankOrderer = ORDRE_TRENTEDEUXIEME;
    } else if (nbQualified > 16) {
      nbRounds = 5;
      rankOrderer = ORDRE_SEIZIEME;
    } else if (nbQualified > 8) {
      nbRounds = 4;
      rankOrderer = ORDRE_HUITIEME;
    } else if (nbQualified > 4) {
      nbRounds = 3;
      rankOrderer = ORDRE_QUART;
    } else if (nbQualified > 2) {
      nbRounds = 2;
      rankOrderer = ORDRE_DEMI;
    } else if (nbQualified > 1) {
      nbRounds = 1;
      rankOrderer = ORDRE_FINALE;
    }

    if (nbQualified > 1) {
      // On initialise tous les matches du bracket
      for (let i = nbRounds; i > 0; i--) {
        let matches = [];
        for (let j = 1; j <= (nbRounds > 1 ? NB_MATCHES_ROUND[i] : 1); j++) {
          matches.push({
            id: j,
            round: i,
            joueurs: [],
          });
        }

        // On créé le document de la rencontre
        const bracket = new Bracket({
          _id: new mongoose.Types.ObjectId(),
          type: i !== 1 ? "Winnerbracket" : "Final",
          objectRef: req.body.format === "double" ? "Binomes" : "Joueurs",
          tableau: req.params.tableau,
          round: i,
          phase: req.params.phase,
          matches: matches,
        });
        await bracket.save();
      }

      let qualified = listPerdants,
        id_match = 1;
      // On créé la liste des joueurs/binômes qualifiés
      if (req.body.poules) {
        for (let i = 0; i < poules.length; i++) {
          qualified = qualified.concat(
            poules[i].participants.slice(
              NB_PARTICIPANTS_PHASES_FINALES[req.params.phase].premier,
              NB_PARTICIPANTS_PHASES_FINALES[req.params.phase].deuxieme
            )
          ); // Nous qualifions les 2 premiers de la poule en phase finale, les 3ème et 4ème en consolante
        }
      } else {
        // Seul le format 'double' peux ne pas avoir de poules
        qualified = helper.shuffle(poules.map((binome) => binome._id));
      }

      let winnerFirst = qualified.filter((_j, index) => index % 2 === 0);
      let winnerSecond = qualified.filter((_j, index) => index % 2 !== 0);
      qualified = [winnerFirst, winnerSecond].flat();

      // On assigne les matches aux joueurs/binômes
      for (let i = 0; i < rankOrderer.length; i++) {
        await setPlayerSpecificMatch(
          nbRounds,
          id_match,
          qualified[req.body.format === "simple" ? rankOrderer[i] - 1 : i],
          req.params.tableau,
          req.params.phase
        );

        if (i % 2 && i !== 0 && req.body.format === "simple")
          id_match++; // On incrémente le n° du match tous les 2 joueurs/binômes
        else if (req.body.format === "double") {
          id_match++;
          if (i === rankOrderer.length / 2 - 1) id_match = 1;
        }
      }

      // Si des joueurs/binômes sont seuls au premier round, ils sont désignés vainqueurs et accèdent au second round
      let firstRound = await Bracket.findOne({
        tableau: req.params.tableau,
        phase: req.params.phase,
      }).sort({ round: "desc" });
      for (let match of firstRound.matches) {
        if (!match.joueurs[1]._id || !match.joueurs[0]._id) {
          let winner_id;
          if (!match.joueurs[1]._id) winner_id = match.joueurs[0]._id;
          else if (!match.joueurs[0]._id) winner_id = match.joueurs[1]._id;

          await defineMatchStatusAndWinner(
            match.round,
            req.params.tableau,
            req.params.phase,
            match.id,
            winner_id
          );
        }
      }
      res.status(200).json({ message: "No error" });
    } else
      res
        .status(500)
        .send(
          "Il n'y a pas assez de " +
            (req.body.format === "simple" ? "joueurs" : "binômes")
        );
  } catch (err) {
    res.status(500).send("Impossible de générer le bracket");
  }
};

// DELETE SPECIFIC OR ALL TABLEAU'S BRACKET(S)
exports.deleteBracket_s = (req, res) => {
  Bracket.deleteMany({ tableau: req.params.idTableau, phase: "consolante" })
    .then(() => res.status(200).json({ message: "Consolante supprimée" }))
    .catch(() =>
      res.status(500).send("Impossible de supprimer la consolante demandée")
    );
};
