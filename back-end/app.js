const cors = require('cors');
const express = require('express');
const session = require('express-session');
const crypto = require('crypto');
const { createServer } = require('http');
require('express-async-errors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const questionsRouter = require('./routes/questions');
const userRouter = require('./routes/user');
const socketServer = require('./socketServer/socketServer');
const middleware = require('./utils/middleware');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const adminRouter = require('./routes/admin');

const app = express();
const httpServer = createServer(app);
mongoose.connect(config.MONGODB_URI);

const sess = {
  secret: crypto.randomBytes(20).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400 * 1000, httpOnly: true },
};
if (config.NODE_ENV === 'production') sess.cookies.secure = true;

app.use(session(sess));
socketServer(httpServer);
if (config.NODE_ENV === 'development') app.use(cors({ origin: ['http://localhost:3001'], credentials: true }));
app.use(express.json());
app.use(express.static('build'));
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use(middleware.authWall);
app.use('/api/user', userRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/admin', adminRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = httpServer;
