const sampleSize = require('lodash.samplesize');
const shuffle = require('lodash.shuffle');

function GroupExamHandler(lobbyId, numOfQuestions, separateQuestions, hostId, io, timeInterval) {
  this.lobbyId = lobbyId;
  this.questions = shuffle(sampleSize(separateQuestions.ee, numOfQuestions.ee).concat(
    sampleSize(separateQuestions.esas, numOfQuestions.esas),
    sampleSize(separateQuestions.math, numOfQuestions.math),
  ));
  this.hostId = hostId;
  this.io = io;
  this.participants = [hostId];
  this.timeInterval = timeInterval;
  this.intervalId = null;
  this.currentNumber = 0;
}

GroupExamHandler.prototype.join = function join(socketId) {
  this.participants.push(socketId);
};

GroupExamHandler.prototype.getParticipants = function getParticipants() {
  return this.participants.slice();
};

GroupExamHandler.prototype.start = function start(socketId) {
  if (socketId !== this.hostId) return;
  this.intervalId = setInterval(() => {
    if (this.currentNumber === this.questions.length) clearInterval(this.intervalId);
    this.io.to(this.lobbyId).emit('new-question', this.questions[this.currentNumber]);
    this.currentNumber += 1;
  }, this.timeInterval);
};

module.exports = GroupExamHandler;
