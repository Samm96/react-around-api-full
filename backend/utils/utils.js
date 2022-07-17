const crypto = require('crypto');

/** Moved later? When making .env */
const secretKey = crypto.randomBytes(32).toString('hex');

const SUCCESS_MSG = 201;

module.exports = { secretKey, SUCCESS_MSG };
