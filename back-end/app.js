const cors = require('cors');
const express = require('express');
const expressSession = require('express-session');
const MemoryStore = require('memorystore')(expressSession);
const crypto = require('crypto');
const { createServer } = require('http');
require('express-async-errors');
const mongoose = require('mongoose');
const path = require('path');
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
  store: new MemoryStore({
    checkPeriod: 86400000,
  }),
  cookie: { maxAge: 86400 * 1000, httpOnly: true },
};

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  sessionConfig.cookie.secure = true;
}

const session = expressSession(sessionConfig);

app.use(session);
socketServer(httpServer, session);
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: ['http://localhost:3001'], credentials: true }));
}

const apiRouter = express.Router();
apiRouter.use('/register', registerRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use(middleware.authWall);
apiRouter.use('/user', userRouter);
apiRouter.use('/questions', questionsRouter);
apiRouter.use('/firebase-token', firebaseRouter);
apiRouter.use(middleware.unknownEndpoint);

app.use(express.json());
app.use(express.static('build'));
app.use('/api', apiRouter);
app.use('/healthcheck', (req, res) => { res.send('ok'); });

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});
app.use(middleware.errorHandler);

module.exports = httpServer;
