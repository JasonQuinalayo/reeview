/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  choices: {
    a: { type: String, required: true },
    b: { type: String, required: true },
    c: { type: String, required: true },
    d: { type: String, required: true },
  },
  maximumLengthChoice: Number,
  category: {
    type: String, required: true, enum: ['esas', 'ee', 'math'], default: 'ee',
  },
  tags: [String],
  answer: { type: String, enum: ['a', 'b', 'c', 'd'], default: 'a' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number },
  imgSrc: { type: String },
});

questionSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Question', questionSchema);
