const sampleSize = require('lodash.samplesize');
const shuffle = require('lodash.shuffle');

function Lobby(lobbyId, numOfQuestions, separateQuestions, host, timeInterval) {
  this.lobbyId = lobbyId;
  this.questions = shuffle(sampleSize(separateQuestions.ee, numOfQuestions.ee).concat(
    sampleSize(separateQuestions.esas, numOfQuestions.esas),
    sampleSize(separateQuestions.math, numOfQuestions.math),
  ));
  this.host = host;
  this.timeInterval = timeInterval * 1000;
  this.intervalId = null;
  this.currentNumber = 0;
  this.participants = { [host.id]: { name: host.name, answers: Array(this.questions.length).fill(''), connected: true } };
  this.finished = false;
}

Lobby.prototype.join = function join(user) {
  this.participants = {
    ...this.participants,
    [user.id]: { name: user.name, answers: Array(this.questions.length).fill(''), connected: true },
  };
};

Lobby.prototype.getParticipantsArray = function getParticipantsArray() {
  return Object.keys(this.participants).map((id) => (
    { id, name: this.participants[id].name, connected: true }));
};

Lobby.prototype.start = function start(io) {
  io.to(this.lobbyId).emit('new-question', this.questions[this.currentNumber].id, this.currentNumber);
  this.currentNumber += 1;
  this.intervalId = setInterval(() => {
    if (this.currentNumber === this.questions.length) {
      clearInterval(this.intervalId);
      io.to(this.lobbyId).emit('finishing');
      setTimeout(() => {
        io.to(this.lobbyId).emit('results', this.calculateResults());
        this.finished = true;
      }, 5000);
      return;
    }
    io.to(this.lobbyId).emit('new-question', this.questions[this.currentNumber].id, this.currentNumber);
    this.currentNumber += 1;
  }, this.timeInterval);
};

Lobby.prototype.inProgress = function inProgress() {
  return this.intervalId !== null;
};

Lobby.prototype.setAnswer = function setAnswer(userId, answer, number) {
  if (number < 0 || number >= this.questions.length || !this.participants[userId]) return;
  this.participants[userId].answers[number] = answer;
};

Lobby.prototype.leave = function leave(userId) {
  delete this.participants[userId];
};

Lobby.prototype.calculateResults = function calculateResults() {
  const results = { examResults: {} };
  Object.keys(this.participants).forEach((id) => {
    const score = this.participants[id].answers.reduce((acc, cur, index) => (
      cur === this.questions[index].answer ? acc + 1 : acc
    ), 0);
    results.examResults[id] = {
      name: this.participants[id].name,
      answers: this.participants[id].answers.slice(),
      score,
    };
  });
  results.examQuestions = this.questions.map((q) => q.id);
  return results;
};

Lobby.prototype.stop = function stop() {
  clearInterval(this.intervalId);
};

Lobby.prototype.disconnect = function disconnect(userId) {
  this.participants[userId].connected = false;
};

Lobby.prototype.reconnect = function reconnect(userId) {
  this.participants[userId].connected = true;
};

Lobby.prototype.areAllDisconnected = function areAllDisconnected() {
  return Object.keys(this.participants).reduce((prev, id) => (
    !this.participants[id].connected && prev
  ), true);
};

module.exports = Lobby;
