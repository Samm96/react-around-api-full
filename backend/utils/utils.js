const crypto = require('crypto');
const { linkRegex, emailRegex } = require('../utils/regex');

export const userJoi = {
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(linkRegex),
      email: Joi.string().email(emailRegex).required(),
      password: Joi.string().required(),
    })
  };

/** Moved later? When making .env */
export const secretKey = crypto.randomBytes(32).toString('hex');