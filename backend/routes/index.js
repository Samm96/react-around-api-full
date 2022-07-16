const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const validateURL = require('../utils/urlValidate');
const auth = require('../middleware/auth');
const { linkRegex, emailRegex } = require('../utils/regex');
const NotFoundError = require('../errors/NotFoundError');
const { requestLogger, errorLogger } = require('../middleware/logger');

const cardsRouter = require('./cards');
const usersRouter = require('./users');

const { userLogin, createUser } = require('../controllers/users');

router.post('/signin', requestLogger, userLogin);
router.post(
  '/signup',
  requestLogger,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(linkRegex).custom(validateURL),
      email: Joi.string().email(emailRegex).required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

// All routes are protected with auth except signin and signup
router.use(auth);

router.use('/cards', cardsRouter);
router.use('/users', requestLogger, usersRouter);

router.use(errorLogger);
router.use(errors());

router.use('*', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;
