/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const pendingQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  choices: {
    a: { type: String, required: true },
    b: { type: String, required: true },
    c: { type: String, required: true },
    d: { type: String, required: true },
  },
  maximumLengthChoice: { type: Number, required: true },
  category: {
    type: String, required: true, enum: ['esas', 'ee', 'math'], default: 'ee',
  },
  tags: [String],
  answer: { type: String, enum: ['a', 'b', 'c', 'd'], default: 'a' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: {
    type: Number,
    validate: {
      validator: (v) => v >= 1970 && v <= (new Date().getFullYear()),
      message: (v) => `${v} is not a valid year`,
    },
  },
  imgSrc: { type: String },
});

pendingQuestionSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('PendingQuestion', pendingQuestionSchema);
