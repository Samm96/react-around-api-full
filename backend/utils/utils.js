const crypto = require('crypto');

/** Moved later? When making .env */
const secretKey = crypto.randomBytes(32).toString('hex');

module.exports = { secretKey };