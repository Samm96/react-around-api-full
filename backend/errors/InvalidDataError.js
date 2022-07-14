const { INVALID_DATA_ERROR_CODE } = require('../utils/errors');

class InvalidDataError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = INVALID_DATA_ERROR_CODE;
    }
}

module.exports = InvalidDataError;