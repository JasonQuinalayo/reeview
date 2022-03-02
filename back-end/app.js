const cors = require('cors');
const express = require('express');
const expressSession = require('express-session');
const crypto = require('crypto');
const { createServer } = require('http');
require('express-async-errors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const socketServer = require('./socketServer/socketServer');
const questionsRouter = require('./routes/questions');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const registerRouter = require('./routes/register');
const firebaseRouter = require('./routes/firebase');

const app = express();
const httpServer = createServer(app);
mongoose.connect(config.MONGODB_URI);

const sessionConfig = {
  secret: crypto.randomBytes(20).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400 * 1000, httpOnly: true },
};
if (process.env.NODE_ENV === 'production') sessionConfig.cookies.secure = true;

const session = expressSession(sessionConfig);

app.use(session);
socketServer(httpServer, session);
if (process.env.NODE_ENV === 'development') app.use(cors({ origin: ['http://localhost:3001'], credentials: true }));
app.use(express.json());
app.use(express.static('build'));
app.use('/api/register', registerRouter);
app.use('/api/auth', authRouter);
app.use(middleware.authWall);
app.use('/api/user', userRouter);
app.use('/api/questions', questionsRouter);
app.use('/api/firebase-token', firebaseRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = httpServer;
