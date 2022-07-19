require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes');
const { errorLogger, requestLogger } = require('./middleware/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Origin',
    'samantha-horsch-around-us.students.nomoredomainssbs.ru',
  );
  res.header(
    'Access-Control-Request-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE',
  );
  res.header(
    'Access-Content-Control-Request-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
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
