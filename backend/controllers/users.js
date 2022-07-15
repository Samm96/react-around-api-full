// all /me paths not working properly (not sure how to test them)

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../utils/utils');
const User = require('../models/user');
const {
  NOT_FOUND_ERROR_CODE,
  AUTHORIZATION_ERROR_CODE,
} = require('../utils/errors');
const ConflictError = require('../errors/ConflictError');
const InternalServerError = require('../errors/InternalServerError');
const CastError = require('../errors/CastError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

// this works
const userLogin = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, {
        expiresIn: '7d',
      });

      res.send({ data: user.toJSON(), token });
    })
    .catch((err) => {
      res.status(AUTHORIZATION_ERROR_CODE).send({ message: err.message });
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      const error = new Error('List of users not found');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((users) => res.send(users))
    .catch(() => {
      next(new InternalServerError('An error occurred on the server'));
    });
};

/** This functions correctly */
const getUser = (req, res, next) => {
  // the specific variable specified in the get request (the ID of the URL)
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      // turn that data into a JavaScript object
      // const parsedUserData = users;
      // find the id that has been requested in the JavaScript object
      // const user = parsedUserData.find(({ _id: userId }) => userId === id);

      if (!user) {
        next(new NotFoundError('User ID not found'));
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('User ID not valid'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('User ID not found'));
      } else {
        next(err);
      }
    });
};

// now it shows error: User ID Invalid (which means its hitting the controller)
const getCurrentUser = (req, res, next) => {
  getUser(req.user, res, next);
};

// ConflictError works
// Bad Request Error not functioning properly (even before when it was res.status.send)
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('This email is already in use');
      } else {
        return bcrypt.hash(password, 10);
      }
    })

    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError('Missing or invalid email or password'),
        );
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('User ID not valid'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('User ID not found'));
      } else if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(', ')}`,
          ),
        );
      } else {
        next(new InternalServerError('An error occurred on the server'));
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      const error = new Error('User ID not found');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('User ID not valid'));
      } else if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(', ')}`,
          ),
        );
      } else {
        next(new InternalServerError('An error occurred on the server'));
      }
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
  userLogin,
  getCurrentUser,
};
