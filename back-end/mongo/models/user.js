/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  passwordHash: { type: String, required: true },
  lastMajorExamResults: {
    totalQuestions: Number,
    correctAnswers: Number,
    mistakes: [{
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      yourAnswer: { type: String, enum: ['A', 'B', 'C', 'D'], default: 'A' },
    }],
  },
  lastPracticeExamResults: {
    totalQuestions: Number,
    correctAnswers: Number,
    mistakes: [{
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      yourAnswer: { type: String, enum: ['A', 'B', 'C', 'D'], default: 'A' },
    }],
  },
  overAllPerformance: {
    esas: { total: Number, answered: Number, percentage: Number },
    ee: { total: Number, answered: Number, percentage: Number },
    math: { total: Number, answered: Number, percentage: Number },
  },
});

userSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.passwordHash;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('User', userSchema);
