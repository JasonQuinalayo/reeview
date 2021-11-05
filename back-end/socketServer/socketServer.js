const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const Lobby = require('./Lobby');
const Question = require('../mongo/models/question');

const lobbies = {};
const idToLobby = {};
const answers = ['a', 'b', 'c', 'd'];

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
      socket.emit('lobbies', Object.keys(lobbies).filter((lobby) => !lobbies[lobby].inProgress()));
    });

    socket.on('create-lobby', async (numOfQuestions, timeInterval) => {
      if (idToLobby[socket.id]) return;
      const questions = await Question.find({});
      const separateQuestions = { ee: [], esas: [], math: [] };
      questions.forEach((question) => separateQuestions[question.category].push(question));
      if (!validateNumOfQuestions(numOfQuestions, separateQuestions)
      || timeInterval < 5 || timeInterval > 30) return;
      const lobbyId = uuidv4();
      idToLobby[socket.id] = lobbyId;
      lobbies[lobbyId] = new Lobby(
        lobbyId, numOfQuestions, separateQuestions, socket.id, timeInterval,
      );
      socket.join(lobbyId);
      socket.emit('join-lobby', lobbyId);
      io.emit('lobbies', Object.keys(lobbies));
    });

    socket.on('join-lobby', (lobbyId) => {
      if (!isString(lobbyId) || idToLobby[socket.id] || !lobbies[lobbyId]
      || lobbies[lobbyId].inProgress()) return;
      lobbies[lobbyId].join(socket.id);
      idToLobby[socket.id] = lobbyId;
      socket.join(lobbyId);
      socket.emit('join-lobby', lobbyId);
    });

    socket.on('start', () => {
      if (!idToLobby[socket.id]) return;
      const lobby = lobbies[idToLobby[socket.id]];
      if (!lobby || lobby.getHost() !== socket.id || lobby.inProgress()) return;
      lobby.start(io);
    });

    socket.on('answer', (answer, number) => {
      if (!idToLobby[socket.id] || !answers.includes(answer)) return;
      lobbies[idToLobby[socket.id]].setAnswer(socket.id, answer, number);
    });

    socket.on('new-message', (message) => {
      if (!isString(message) || !idToLobby[socket.id]) return;
      io.to(idToLobby[socket.id]).emit('new-message', { content: message, sender: socket.id });
    });

    socket.on('get-participants', () => {
      if (!idToLobby[socket.id]) return;
      const lobby = lobbies[idToLobby[socket.id]];
      if (!lobby) return;
      io.to(idToLobby[socket.id]).emit('participants', lobby.getParticipants());
    });
  });
};

module.exports = socketServer;
