const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const User = require('../models/user');

const ConflictError = require('../errors/ConflictError');
const InternalServerError = require('../errors/InternalServerError');
const CastError = require('../errors/CastError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const AuthorizationError = require('../errors/AuthorizationError');

// this works
const userLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.send({ data: user.toJSON(), token });
    })
    .catch(() => {
      next(new AuthorizationError('Incorrect email or password'));
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      throw new NotFoundError('List of users not found');
    })
    .then((users) => res.send(users))
    .catch(() => {
      next(new InternalServerError('An error occurred on the server'));
    });
};

/** This functions correctly */
const getUser = (req, res, next) => {
  // the specific variable specified in the get request (the ID of the URL)
  const id = (req.params.id !== 'me' ? req.params.id : req.user._id);

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

// works with temp auth solution
const getCurrentUser = (req, res, next) => {
  getUser(req, res, next);
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
          new AuthorizationError('Missing or invalid email or password'),
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
      throw new NotFoundError('User ID not found');
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
