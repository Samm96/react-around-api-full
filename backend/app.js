require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const routes = require('./routes');
const { linkRegex, emailRegex } = require('./utils/regex');
const validateURL = require('./utils/urlValidate');
const { errorLogger, requestLogger } = require('./middleware/logger');
const { allowedCors, DEFAULT_ALLOWED_METHODS } = require('./utils/utils');
const { userLogin, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    allowedCors,
  );
  res.header(
    'Access-Content-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header(
    'Access-Control-Allow-Methods',
    DEFAULT_ALLOWED_METHODS,
  );
  next();
});

app.use(requestLogger);

// REMEMBER: REMOVE AFTER PASS REVIEW
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post(
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
app.post('/signin', requestLogger, userLogin);

app.use(routes);
app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
