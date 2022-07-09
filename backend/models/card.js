const mongoose = require('mongoose');
const { linkRegex } = require('../utils/regex');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Required field'],
    minLength: [2, 'The NAME field length is too short (min: 2)'],
    maxLength: [30, 'The NAME field length is too long (max: 30)'],
  },

  link: {
    type: String,
    required: [true, 'Required field'],
    validate: {
      validator: (v) => linkRegex.test(v),
      message: 'This is not a valid URL',
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);
