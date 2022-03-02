const bcrypt = require('bcrypt');
const { checkSchema, validationResult } = require('express-validator');
const userRouter = require('express').Router();
const User = require('../mongo/models/user');
const { AuthorizationError, RequestError, ApiValidationError } = require('../utils/errors');

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

userRouter.post('/change-password',
  checkSchema({
    password: {
      in: ['body'],
      isAscii: {
        errorMessage: 'Password must consist of ASCII characters only',
      },
      isLength: {
        options: { min: 3, max: 40 },
        errorMessage: 'Password must be between 3 and 40 characters long',
      },
    },
    newPassword: {
      in: ['body'],
      isAscii: {
        errorMessage: 'New Password must consist of ASCII characters only',
      },
      isLength: {
        options: { min: 3, max: 40 },
        errorMessage: 'New Password must be between 3 and 40 characters long',
      },
    },
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new ApiValidationError(errors.array(), 'Invalid body properties');
    const { password, newPassword } = req.body;
    const user = await User.findById(req.session.user.id);
    if (!user) throw new RequestError('User not found');
    const authorized = await bcrypt.compare(password, user.passwordHash);
    if (!authorized) throw new AuthorizationError('Invalid password');
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await user.updateOne({ passwordHash: newPasswordHash });
    res.send(user);
  });

userRouter.get('/admins', async (req, res) => {
  const admins = await User.find({ isAdmin: true });
  res.send(admins.map((admin) => ({ name: admin.name, id: admin._id.toString() })));
});

userRouter.post('/promote/:id', async (req, res) => {
  if (!req.session.user.isAdmin) throw new AuthorizationError('Promoting users requires admin privileges');
  const user = await User.findById(req.params.id);
  if (!user) res.status(404).end();
  await user.updateOne({ isAdmin: true });
  res.status(201).send({ name: user.name, id: user._id.toString(), isAdmin: true });
});

userRouter.get('/all', async (req, res) => {
  if (!req.session.user.isAdmin) throw new AuthorizationError('Getting all users requires admin privileges');
  const users = await User.find({});
  res.send(users.map((user) => ({
    name: user.name,
    id: user._id.toString(),
    isAdmin: user.isAdmin,
  })));
});

module.exports = userRouter;
