const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    jwt.verify(req.headers.authorization, process.env.APP_SECRET);
    next();
  } catch {
    if (req.headers.authorization === 'ANONYMOUSLY_LOGGED') { next() }
    else res.status(500).send('Vous n\'êtes pas connecté.')
  }
};
