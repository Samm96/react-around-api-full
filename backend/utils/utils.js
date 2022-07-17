const crypto = require('crypto');

/** Moved later? When making .env */
const secretKey = crypto.randomBytes(32).toString('hex');

const SUCCESS_MSG = 201;

// CORS
const allowedCors = 'https://api.samantha-horsch-around-us.students.nomoredomainssbs.ru';
const DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';

module.exports = {
  secretKey,
  SUCCESS_MSG,
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};
