/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String, minlength: 6, maxlength: 100, required: true,
  },
  name: {
    type: String, minLength: 3, maxLength: 32, required: true,
  },
  isAdmin: { type: Boolean, default: false },
  passwordHash: { type: String, required: true },
  lastGroupExamResults: {
    totalQuestions: Number,
    correctAnswers: Number,
    mistakes: [{
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      yourAnswer: { type: String, enum: ['a', 'b', 'c', 'd'], default: 'a' },
    }],
  },
  lastPracticeExamResults: {
    totalQuestions: Number,
    correctAnswers: Number,
    mistakes: [{
      question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      yourAnswer: { type: String, enum: ['a', 'b', 'c', 'd'], default: 'a' },
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
