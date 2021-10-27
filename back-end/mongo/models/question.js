/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  choices: {
    A: { type: String, required: true },
    B: { type: String, required: true },
    C: { type: String, required: true },
    D: { type: String, required: true },
  },
  maximumLengthChoice: Number,
  category: {
    type: String, required: true, enum: ['esas', 'ee', 'math'], default: 'ee',
  },
  tags: [String],
  answer: { type: String, enum: ['A', 'B', 'C', 'D'], default: 'A' },
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
