const mongoose = require('mongoose');
const { linkRegex, emailRegex } = require('../utils/regex');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [2, 'The NAME field length is too short (min: 2)'],
    maxLength: [30, 'The NAME field length is too long (max: 30)'],
    required: [true, 'Required field'],
  },

  about: {
    type: String,
    minLength: [2, 'The ABOUT field length is too short (min: 2)'],
    maxLength: [30, 'The ABOUT field length is too long (max: 30)'],
    required: [true, 'Required field'],
  },

  avatar: {
    type: String,
    required: [true, 'Required field'],
    validate: {
      validator: (v) => linkRegex.test(v),
      message: 'This is not a valid URL',
    },
  },

  email: {
    type: String,
    required: [true, 'Required field'],
    unique: true,
    validate: {
      validator: (v) => emailRegex.test(v),
      message: 'This is not a valid email'
    }
  },

  password: {
    type: String,
    required: [true, 'Required field'],
  }
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
