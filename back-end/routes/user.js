const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../mongo/models/user');

userRouter.get('/', async (req, res) => {
  const user = await User.findById(req.session.user.id);
  req.session.user = {
    username: user.username,
    name: user.name,
    id: user._id.toString(),
    isAdmin: user.isAdmin,
  };
  res.send(user);
});

userRouter.post('/change-password', async (req, res) => {
  const { password, newPassword } = req.body;
  const user = await User.findById(req.session.userId);
  const authorized = await bcrypt.compare(password, user.passwordHash);
  if (!authorized) throw new Error('invalid password');
  if (!newPassword || newPassword.length < 3) throw new Error('bad request');
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await user.update({ passwordHash: newPasswordHash });
  res.send(user);
});

userRouter.post('/change-name', async (req, res) => {
  const { password, newName } = req.body;
  const user = await User.findById(req.session.userId);
  const authorized = await bcrypt.compare(password, user.passwordHash);
  if (!authorized) throw new Error('invalid password');
  if (!newName || newName.length < 3 || newName.length > 24) throw new Error('bad request');
  await user.update({ name: newName });
  req.session.user.name = newName;
  res.send(user);
});

userRouter.post('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.status(204).end();
  });
});

module.exports = userRouter;
