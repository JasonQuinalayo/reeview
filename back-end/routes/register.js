const registerRouter = require('express').Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../mongo/models/user');

let links = [];

registerRouter.post('/add-link', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) throw new Error('unauthorized');
  const newLink = crypto.randomBytes(32).toString('base64url');
  links = links.concat(newLink);
  setTimeout(() => { links = links.filter((link) => link !== newLink); }, 1000 * 60 * 5);
  res.send(newLink);
});

registerRouter.post('/:link', async (req, res) => {
  if (!links.includes(req.params.link)) throw new Error('unauthorized');
  links = links.filter((link) => link !== req.params.link);
  const { name, username, password } = req.body;
  if (password.length < 3) throw new Error('password too short');
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({ name, username, passwordHash });
  await newUser.save({ validateBeforeSave: true });
  req.session.user = {
    name: newUser.name,
    username: newUser.username,
    id: newUser._id.toString(),
    isAdmin: newUser.isAdmin,
  };
  res.send(newUser);
});

module.exports = registerRouter;
