const { AuthorizationError } = require('./errors');

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const authWall = (req, res, next) => {
  if (!req.session.user) throw new AuthorizationError('You need to be logged in');
  next();
};

const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  if (process.env.ERRORS === 'print') console.error(err);
  if (err.name === 'CastError') {
    res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError' || err.name === 'RequestError') {
    res.status(400).send({ error: err.message });
  } else if (err.name === 'ApiValidationError') {
    res.status(400).send({
      message: err.message,
      errors: err.errors.map((e) => ({ error: e.msg, value: e.value })),
    });
  } else if (err.name === 'AuthorizationError') {
    res.status(401).send({ error: err.message });
  }
  next(err);
};

module.exports = {
  unknownEndpoint,
  authWall,
  errorHandler,
};
