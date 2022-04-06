/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');

const userActionSchema = new mongoose.Schema({
  by: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
  },
  date: {
    type: mongoose.Schema.Types.Date, required: true,
  },
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  choices: {
    a: { type: String, required: true },
    b: { type: String, required: true },
    c: { type: String, required: true },
    d: { type: String, required: true },
  },
  answer: {
    type: String, enum: ['a', 'b', 'c', 'd'], default: 'a', required: true,
  },
  category: {
    type: String, required: true, enum: ['esas', 'ee', 'math'], default: 'ee',
  },
  tags: [String],
  submitted: {
    type: userActionSchema, required: true,
  },
  approved: userActionSchema,
  year: {
    type: Number,
    validate: {
      validator: (v) => ((
        v >= 1970) && (v <= (new Date()).getFullYear())),
      message: (v) => `${v} is not a valid year`,
    },
  },
  imgSrc: { type: String },
  suggestedUpdates: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  ],
  updateTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
});

questionSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Question', questionSchema);
