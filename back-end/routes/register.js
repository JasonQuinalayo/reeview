const registerRouter = require('express').Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const {
  checkSchema, validationResult,
} = require('express-validator');
const User = require('../mongo/models/user');
const { AuthorizationError, ApiValidationError, RequestError } = require('../utils/errors');

let links = [];

registerRouter.post('/add-link', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) throw new AuthorizationError('Adding registration links requires admin privileges');
  const newLink = crypto.randomBytes(32).toString('hex');
  links = links.concat(newLink);
  setTimeout(() => { links = links.filter((link) => link !== newLink); }, process.env.NODE_ENV === 'test' ? 5 * 1000 : 1000 * 60 * 30);
  res.status(201).send(newLink);
});

registerRouter.post('/:link',
  checkSchema({
    username: {
      in: ['body'],
      isAlphanumeric: {
        errorMessage: 'Username must be alphanumeric',
      },
      isLength: {
        options: { min: 6, max: 40 },
        errorMessage: 'Username must be between 6 and 40 characters long',
      },
    },
    name: {
      in: ['body'],
      custom: {
        options: (value) => {
          if (!(/^[A-Za-z0-9 ]+$/.test(value))) throw new Error('Name must be alphanumeric with/without spaces');
          if (value.length < 3 || value.length > 40) throw new Error('Name must be between 3 and 40 characters long');
          return true;
        },
      },
    },
    password: {
      in: ['body'],
      isAscii: {
        errorMessage: 'Password must consist of ASCII characters only',
      },
      isLength: {
        options: { min: 3, max: 40 },
        errorMessage: 'Password must be between 3 and 100 characters long',
      },
    },
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throw new ApiValidationError(errors.array(), 'Invalid request body properties');
    if (!links.includes(req.params.link)) throw new AuthorizationError('Invalid registration link');
    const { name, username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) throw new RequestError('Username already taken');
    if (req.session.user) throw new RequestError('Cannot register new account while logged in');
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, username, passwordHash });
    await newUser.save({ validateBeforeSave: true });
    links = links.filter((link) => link !== req.params.link);
    req.session.user = {
      name: newUser.name,
      username: newUser.username,
      id: newUser._id.toString(),
      isAdmin: false,
    };
    res.status(201).send(newUser);
  });

module.exports = registerRouter;
