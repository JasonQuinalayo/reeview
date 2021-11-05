const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const authWall = (req, res, next) => {
  if (!req.session.user) throw new Error('unauthorized');
  next();
};

const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError' || err.message === 'password too short') {
    res.status(400).send({ error: err.message });
  } else if (['unauthorized', 'invalid password', 'invalid username or password'].includes(err.message)) {
    res.status(401).send({ error: err.message });
  }
  next(err);
};

module.exports = {
  unknownEndpoint,
  authWall,
  errorHandler,
};
