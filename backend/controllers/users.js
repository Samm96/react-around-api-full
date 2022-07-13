const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secretKey } = require('../utils/utils');
const User = require("../models/user");
const {
  INVALID_DATA_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INT_SERVER_ERROR_CODE,
  CAST_ERROR_CODE,
  AUTHORIZATION_ERROR_CODE,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      const error = new Error("List of users not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res
        .status(INT_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred with the server" });
    });
};

const getUser = (req, res) => {
  // the specific variable specified in the get request (the ID of the URL)
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      // turn that data into a JavaScript object
      // const parsedUserData = users;
      // find the id that has been requested in the JavaScript object
      // const user = parsedUserData.find(({ _id: userId }) => userId === id);

      if (!user) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: "User ID not found" });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(CAST_ERROR_CODE).send({ message: "User ID not valid" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: "User ID not found" });
      } else {
        res
          .status(INT_SERVER_ERROR_CODE)
          .send({ message: "An error has occurred with the server" });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name: name,
      about: about,
      avatar: avatar,
      email: email,
      password: hash,
    })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === "ValidationError") {
          res.status(INVALID_DATA_ERROR_CODE).send({
            message: `${Object.values(err.errors)
              .map((error) => error.message)
              .join(", ")}`,
          });
        } else {
          res
            .status(INT_SERVER_ERROR_CODE)
            .send({ message: "An error occurred while creating user" });
        }
      });
  });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(CAST_ERROR_CODE).send({ message: "User ID not valid" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: "User ID not found" });
      } else if (err.name === "ValidationError") {
        res.status(INVALID_DATA_ERROR_CODE).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
        });
      } else {
        res
          .status(INT_SERVER_ERROR_CODE)
          .send({ message: "An error has occurred with the server" });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    }
  )
    .orFail(() => {
      const error = new Error("User ID not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(CAST_ERROR_CODE).send({ message: "User ID not valid" });
      } else if (err.name === "ValidationError") {
        res.status(INVALID_DATA_ERROR_CODE).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(", ")}`,
        });
      } else {
        res
          .status(INT_SERVER_ERROR_CODE)
          .send({ message: "An error has occurred with the server" });
      }
    });
};

const userLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, {
        expiresIn: "7d",
      });

      bcrypt.compare(password, user.password)

      if(password === user.password) {
        res.send({ token });
      }
    })
    .then((matched) => {
      if (!matched) {
        res
          .status(INVALID_DATA_ERROR_CODE)
          .send({ message: "Incorrect email or password" });
      }
    })
    .catch((err) => {
      res.status(AUTHORIZATION_ERROR_CODE).send(err.message);
    });
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  updateAvatar,
  userLogin,
};
