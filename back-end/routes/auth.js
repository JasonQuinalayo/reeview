const bcrypt = require('bcrypt');
const authRouter = require('express').Router();
const User = require('../mongo/models/user');

authRouter.post('/login', async (req, res) => {
  const { body } = req;
  const user = await User.findOne({ username: body.username }).lean();
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) throw new Error('invalid username or password');

  req.session.user = {
    username: user.username,
    name: user.name,
    id: user._id.toString(),
    isAdmin: user.isAdmin,
  };
  res.send(req.session.user);
});

authRouter.post('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.status(204).end();
  });
});

module.exports = authRouter;
