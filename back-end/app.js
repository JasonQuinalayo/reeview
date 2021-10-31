const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { createServer } = require('http');
const config = require('./utils/config');
const questionsRouter = require('./routes/questions');
const usersRouter = require('./routes/users');
const socketServer = require('./socketServer/socketServer');

const app = express();
const httpServer = createServer(app);
mongoose.connect(config.MONGODB_URI);

socketServer(httpServer);

if (process.env.NODE_ENV === 'development') app.use(cors());
app.use(express.json());
app.use(express.static('build'));
app.use('/api/users', usersRouter);
app.use('/api/questions', questionsRouter);

module.exports = httpServer;
