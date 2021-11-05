const adminRouter = require('express').Router();
const User = require('../mongo/models/user');

adminRouter.get('/', async (req, res) => {
  const admins = await User.find({ isAdmin: true });
  res.send(admins.map((admin) => ({ name: admin.name, id: admin._id.toString() })));
});

adminRouter.post('/promote/:id', async (req, res) => {
  if (!req.session.user.isAdmin) throw new Error('unauthorized');
  const user = await User.findById(req.params.id);
  if (!user) res.status(404).end();
  await user.update({ isAdmin: true });
  res.status(200).end();
});

adminRouter.get('/users', async (req, res) => {
  if (!req.session.user.isAdmin) throw new Error('unauthorized');
  const users = await User.find({});
  res.send(users.map((user) => ({
    name: user.name,
    id: user._id.toString(),
    isAdmin: user.isAdmin,
  })));
});

module.exports = adminRouter;
