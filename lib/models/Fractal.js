/* eslint-disable no-undef */
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contributingUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  generatingCode: {
    type: JavaScript,
    required: true
  }
});

module.exports = mongoose.model('Fractal', schema);
