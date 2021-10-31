const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const GroupExamHandler = require('./GroupExamHandler');
const Question = require('../mongo/models/question');

const lobbies = {};
const idToLobby = {};

const isString = (str) => (typeof str === 'string' || str instanceof String);
const validateNumOfQuestions = (numOfQuestions, sepQuestions) => {
  const schema = {
    ee: (num) => typeof num === 'number' && num >= 0 && num < sepQuestions.ee.length,
    esas: (num) => typeof num === 'number' && num >= 0 && num < sepQuestions.esas.length,
    math: (num) => typeof num === 'number' && num >= 0 && num <= sepQuestions.math.length,
  };
  return typeof numOfQuestions === 'object' && Object.keys(schema).reduce((prev, key) => (
    schema[key](numOfQuestions[key] && prev)
  ), true) && numOfQuestions.ee + numOfQuestions.esas + numOfQuestions.math > 0;
};

const socketServer = (httpServer) => {
  const io = new Server(httpServer, process.env.NODE_ENV === 'development' ? { cors: { origin: '*' } } : undefined);
  io.on('connection', (socket) => {
    socket.on('get-lobbies', () => {
      socket.emit('lobbies', Object.keys(lobbies));
    });

    socket.on('create-lobby', async (numOfQuestions, timeInterval) => {
      if (idToLobby[socket.id]) return;
      const questions = await Question.find({});
      const separateQuestions = { ee: [], esas: [], math: [] };
      questions.forEach((question) => separateQuestions[question.category].push(question));
      if (!validateNumOfQuestions(numOfQuestions, separateQuestions)
      || timeInterval < 5 || timeInterval > 30) return;
      const id = uuidv4();
      idToLobby[socket.id] = id;
      lobbies[id] = new GroupExamHandler(
        id, numOfQuestions, separateQuestions, socket.id, io, timeInterval,
      );
      socket.join(id);
      socket.emit('join-lobby', id);
    });

    socket.on('join-lobby', (lobbyId) => {
      if (!isString(lobbyId) || idToLobby[socket.id] || !lobbies[lobbyId]) return;
      lobbies[lobbyId].join(socket.id);
      idToLobby[socket.id] = lobbyId;
      socket.join(lobbyId);
      io.to(lobbyId).emit(lobbies[lobbyId].getParticipants());
    });

    socket.on('start', (lobbyId) => {
      if (!isString(lobbyId) || !lobbies[lobbyId]) return;
      lobbies[lobbyId].start(socket.id);
    });
  });
};

module.exports = socketServer;
