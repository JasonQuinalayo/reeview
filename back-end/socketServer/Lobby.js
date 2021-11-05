const sampleSize = require('lodash.samplesize');
const shuffle = require('lodash.shuffle');

function Lobby(lobbyId, numOfQuestions, separateQuestions, hostId, timeInterval) {
  this.lobbyId = lobbyId;
  this.questions = shuffle(sampleSize(separateQuestions.ee, numOfQuestions.ee).concat(
    sampleSize(separateQuestions.esas, numOfQuestions.esas),
    sampleSize(separateQuestions.math, numOfQuestions.math),
  ));
  this.hostId = hostId;
  this.timeInterval = timeInterval * 1000;
  this.intervalId = null;
  this.currentNumber = 0;
  this.participantsAnswers = { [hostId]: Array(this.questions.length).fill('') };
}

Lobby.prototype.join = function join(socketId) {
  this.participantsAnswers = {
    ...this.participantsAnswers,
    [socketId]: Array(this.questions.length).fill(''),
  };
};

Lobby.prototype.getParticipants = function getParticipants() {
  return Object.keys(this.participantsAnswers);
};

Lobby.prototype.getHost = function getHost() {
  return this.hostId;
};

Lobby.prototype.start = function start(io) {
  this.intervalId = setInterval(() => {
    if (this.currentNumber === this.questions.length) {
      clearInterval(this.intervalId);
      io.to(this.lobbyId).emit('finishing');
      setTimeout(() => {
        io.to(this.lobbyId).emit('results', this.calculateResults(), this.questions.map((q) => q.id));
      }, this.timeInterval);
      return;
    }
    io.to(this.lobbyId).emit('new-question', this.questions[this.currentNumber].id, this.currentNumber);
    this.currentNumber += 1;
  }, this.timeInterval);
};

Lobby.prototype.inProgress = function inProgress() {
  return this.intervalId !== null;
};

Lobby.prototype.setAnswer = function setAnswer(socketId, answer, number) {
  if (number < 0 || number >= this.questions.length || !this.participantsAnswers[socketId]) return;
  this.participantsAnswers[socketId][number] = answer;
};

Lobby.prototype.calculateResults = function calculateResults() {
  const results = {};
  Object.keys(this.participantsAnswers).forEach((id) => {
    const score = this.participantsAnswers[id].reduce((acc, cur, index) => (
      cur === this.questions[index].answer ? acc + 1 : acc
    ), 0);
    results[id] = {
      answers: this.participantsAnswers[id].slice(),
      score: `${score} / ${this.questions.length}`,
    };
  });
  return results;
};

module.exports = Lobby;
