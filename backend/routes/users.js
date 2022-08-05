const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser, getUsers, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:id', celebrate({
  body: Joi.object().keys({
    ObjectId: Joi.string().hex().length(24),
  }),
}), getUser);

router.get('/me', getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    ObjectId: Joi.string().hex().length(24),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    ObjectId: Joi.string().hex().length(24),
  }),
}), updateAvatar);

module.exports = router;
