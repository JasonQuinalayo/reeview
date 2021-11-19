const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  value: { type: String, enum: ['a', 'b', 'c', 'd'], default: 'a' },
});
