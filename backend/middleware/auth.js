const {
    AUTHORIZATION_ERROR_CODE,
  } = require("../utils/errors");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../utils/utils");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(AUTHORIZATION_ERROR_CODE).send({ message: 'Authorization required'});
    }

    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
        payload = jwt.verify(token, secretKey);
    } catch (err) {
        res.status(AUTHORIZATION_ERROR_CODE).send({ message: 'Authorization required'});
    }

    req.user = payload; // assigns payload to request object

    return next();
}