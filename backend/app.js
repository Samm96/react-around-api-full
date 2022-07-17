require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes');
const { errorLogger, requestLogger } = require('./middleware/logger');
const { allowedCors, DEFAULT_ALLOWED_METHODS } = require('./utils/utils');

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

mongoose.connect('mongodb://localhost:27017/aroundb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

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

app.use(cors());
app.options('*', cors());

app.use(requestLogger);

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
