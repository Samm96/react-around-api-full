const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cors = require('cors');
const validateURL = require('../utils/urlValidate');
const auth = require('../middleware/auth');
const { linkRegex, emailRegex } = require('../utils/regex');
const NotFoundError = require('../errors/NotFoundError');
const { requestLogger } = require('../middleware/logger');

const cardsRouter = require('./cards');
const usersRouter = require('./users');

const { userLogin, createUser } = require('../controllers/users');

router.use(cors());

router.post('/signin', requestLogger, userLogin);
router.post(
  '/signup',
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

router.use(cors());
router.options('*', cors());

// All routes are protected with auth except signin and signup
router.use(auth);

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;
