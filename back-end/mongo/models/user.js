/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const answerSchema = require('../answerSchema');

const examResultsSchema = mongoose.Schema({
  totalQuestions: Number,
  correctAnswers: Number,
  mistakes: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    userAnswer: { type: answerSchema, required: true },
  }],
});

const performanceSchema = new mongoose.Schema({
  total: Number, answered: Number, percentage: Number,
});

const userSchema = new mongoose.Schema({
  username: {
    type: String, minlength: 6, maxlength: 100, required: true,
  },
  name: {
    type: String, minLength: 3, maxLength: 32, required: true,
  },
  isAdmin: { type: Boolean, default: false },
  passwordHash: { type: String, required: true },
  lastGroupExamResults: examResultsSchema,
  lastPracticeExamResults: examResultsSchema,
  overAllPerformance: new mongoose.Schema({
    ee: performanceSchema,
    esas: performanceSchema,
    math: performanceSchema,
  }),
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
