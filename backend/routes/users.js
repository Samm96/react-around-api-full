const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkRegex, emailRegex } = require('../utils/regex');

const {
  getUser, getUsers, createUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(linkRegex),
    email: Joi.string().email(emailRegex).required(),
    password: Joi.string().required(),
  }),
}), createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
