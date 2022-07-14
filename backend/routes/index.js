const router = require('express').Router();
const auth = require('../middleware/auth');
const { celebrate, Joi } = require("celebrate");
const { linkRegex, emailRegex } = require("../utils/regex");
const NotFoundError = require('../errors/NotFoundError');

const cardsRouter = require('./cards');
const usersRouter = require('./users');

const { userLogin, createUser } = require('../controllers/users');

router.post("/signin", userLogin);
router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(linkRegex),
      email: Joi.string().email(emailRegex).required(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

// All routes are protected with auth except signin and signup
router.use(auth);

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;
