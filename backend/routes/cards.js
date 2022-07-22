const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { requestLogger } = require('../middleware/logger');
const { linkRegex } = require('../utils/regex');
const validateURL = require('../utils/urlValidate');

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', requestLogger, celebrate({
  body: Joi.object().keys({
    ObjectId: Joi.string().hex().length(24),
    name: Joi.string().min(2).max(30),
    link: Joi.string().regex(linkRegex).custom(validateURL),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  body: Joi.object().keys({
    ObjectId: Joi.string().hex().length(24),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    ObjectId: Joi.string().hex().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    ObjectId: Joi.string().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
