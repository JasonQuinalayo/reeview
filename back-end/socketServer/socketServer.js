const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const Lobby = require('./Lobby');
const Question = require('../mongo/models/question');

const lobbies = {};
let idToLobby = {};
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

const socketServer = (httpServer, expressSession) => {
  const io = new Server(httpServer, process.env.NODE_ENV === 'development'
    ? { cors: { origin: 'http://localhost:3001', credentials: true } } : undefined);
  io.use((socket, next) => expressSession(socket.request, {}, next));
  io.use((socket, next) => {
    if (socket.request.session.user) next();
    else next(new Error('unauthorized'));
  });
  io.on('connection', (socket) => {
    const { user } = socket.request.session;

    const getWaitingLobbies = () => (
      Object.keys(lobbies)
        .filter((lobby) => !lobbies[lobby].inProgress())
        .map((lobby) => ({ id: lobby, host: lobbies[lobby].host.name }))
    );

    const closeLobby = (lobbyId) => {
      const lobby = lobbies[lobbyId];
      if (!lobby) return;
      io.to(lobbyId).emit('leave-lobby');
      lobby.stop();
      const newIdToLobby = {};
      Object.keys(idToLobby).filter((id) => !lobby.participants[id]).forEach((id) => {
        newIdToLobby[id] = idToLobby[id];
      });
      idToLobby = newIdToLobby;
      delete lobbies[lobbyId];
    };

    socket.on('get-lobbies', () => {
      socket.emit('lobbies', getWaitingLobbies());
    });

    socket.on('get-results', () => {
      if (!idToLobby[user.id]) return;
      const lobby = lobbies[idToLobby[user.id]];
      if (!lobby.finished) return;
      socket.emit('results', lobby.calculateResults());
    });

    socket.on('get-lobby', () => {
      if (!idToLobby[user.id]) socket.emit('lobby', null);
      else socket.emit('lobby', { id: idToLobby[user.id], host: lobbies[idToLobby[user.id]].host.id === user.id });
    });

    socket.on('create-lobby', async (numOfQuestions, timeInterval) => {
      if (idToLobby[user.id]) return;
      const questions = await Question.find({});
      const separateQuestions = { ee: [], esas: [], math: [] };
      questions.forEach((question) => separateQuestions[question.category].push(question));
      if (!validateNumOfQuestions(numOfQuestions, separateQuestions)
      || timeInterval < 5 || timeInterval > 30) return;
      const lobbyId = uuidv4();
      idToLobby[user.id] = lobbyId;
      lobbies[lobbyId] = new Lobby(
        lobbyId, numOfQuestions, separateQuestions, { id: user.id, name: user.name }, timeInterval,
      );
      socket.join(lobbyId);
      socket.emit('join-lobby', lobbyId);
      io.emit('lobbies', getWaitingLobbies());
    });

    socket.on('join-lobby', (lobbyId) => {
      if (!isString(lobbyId) || idToLobby[user.id] || !lobbies[lobbyId]
      || lobbies[lobbyId].inProgress()) return;
      lobbies[lobbyId].join({ id: user.id, name: user.name });
      idToLobby[user.id] = lobbyId;
      socket.join(lobbyId);
      socket.emit('join-lobby', lobbyId);
    });

    socket.on('start', () => {
      if (!idToLobby[user.id]) return;
      const lobby = lobbies[idToLobby[user.id]];
      if (!lobby || lobby.host.id !== user.id || lobby.inProgress()) return;
      lobby.start(io);
    });

    socket.on('answer', (answer, number) => {
      if (!idToLobby[user.id] || !answers.includes(answer)) return;
      lobbies[idToLobby[user.id]].setAnswer(user.id, answer, number);
    });

    socket.on('new-message', (message) => {
      if (!isString(message) || !idToLobby[user.id]) return;
      io.to(idToLobby[user.id]).emit('new-message', { content: message, sender: user.name });
    });

    socket.on('get-participants', () => {
      if (!idToLobby[user.id]) return;
      const lobby = lobbies[idToLobby[user.id]];
      if (!lobby) return;
      io.to(lobby.lobbyId).emit('participants', lobby.getParticipantsArray());
    });

    socket.on('leave-lobby', () => {
      if (!idToLobby[user.id]) return;
      const lobby = lobbies[idToLobby[user.id]];
      if (lobby.finished) {
        lobby.leave(user.id);
      } else if (lobby.host.id === user.id) {
        if (lobby.inProgress()) {
          lobby.leave(user.id);
        } else {
          closeLobby(lobby.lobbyId);
        }
      } else {
        lobby.leave(user.id);
      }
      if (lobby.getParticipantsArray().length === 0) {
        closeLobby(lobby.lobbyId);
      }
      socket.emit('leave-lobby');
      io.to(lobby.lobbyId).emit('participants', lobby.getParticipantsArray());
      delete idToLobby[user.id];
    });

    socket.on('reconnect', () => {
      if (!idToLobby[user.id]) return;
      const lobby = lobbies[idToLobby[user.id]];
      lobby.reconnect(user.id);
      socket.join(lobby.lobbyId);
    });

    socket.on('disconnect', () => {
      if (!idToLobby[user.id]) return;
      const lobby = lobbies[idToLobby[user.id]];
      lobby.disconnect(user.id);
      if (lobby.areAllDisconnected()) closeLobby(lobby.lobbyId);
    });
  });
};

module.exports = socketServer;
