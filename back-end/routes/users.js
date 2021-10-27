const usersRouter = require('express').Router();
const User = require('../mongo/models/user');

usersRouter.get('/', async (_, res) => {
  const users = await User.find({});
  res.send(users.map((user) => ({
    name: user.name,
    isAdmin: user.isAdmin,
  })));
});

usersRouter.get('/:id', async (req, res) => {
  res.send(req.params.id);
});

usersRouter.post('/', async (_, res) => {
  res.send('Post /');
});

module.exports = usersRouter;
