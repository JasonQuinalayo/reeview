/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const examResultsSchema = mongoose.Schema({
  totalQuestions: Number,
  correctAnswers: Number,
  mistakes: [{
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    userAnswer: {
      type: String, enum: ['a', 'b', 'c', 'd'], default: 'a', required: true,
    },
  }],
});

const performanceSchema = new mongoose.Schema({
  total: Number, answered: Number, percentage: Number,
});

const userSchema = new mongoose.Schema({
  username: {
    type: String, minlength: 6, maxlength: 40, required: true, match: /^[A-Za-z0-9]+$/,
  },
  name: {
    type: String, minLength: 3, maxLength: 40, required: true, match: /^[A-Za-z0-9]+$/,
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
