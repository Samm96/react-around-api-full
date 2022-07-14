const Card = require('../models/card');
const {
  BAD_REQUEST_ERROR_CODE, NOT_FOUND_ERROR_CODE, INT_SERVER_ERROR_CODE, CAST_ERROR_CODE,
} = require('../utils/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(INT_SERVER_ERROR_CODE).send({ message: 'An error has occurred with the server' });
    });
};

const createCard = (req, res) => {
  console.log(req.user._id); // _id will become accessible (this is hardcoded)
  // Project: "We've hardcoded the user ID, so the card will have the same author in the database
  // regardless of who actually created it."

  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      } else {
        res.status(INT_SERVER_ERROR_CODE).send({ message: 'An error has occurred with the server' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => {
      const error = new Error('Card ID not found');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((card) => Card.deleteOne(card))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CAST_ERROR_CODE).send({ message: 'Card ID not valid' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Card ID not found' });
      } else {
        res.status(INT_SERVER_ERROR_CODE).send({ message: 'An error has occurred with the server' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CAST_ERROR_CODE).send({ message: 'Card ID not valid' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Card ID not found' });
      } else {
        res.status(INT_SERVER_ERROR_CODE).send({ message: 'An error has occurred with the server' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CAST_ERROR_CODE).send({ message: 'Card ID not valid' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Card ID not found' });
      } else {
        res.status(INT_SERVER_ERROR_CODE).send({ message: 'An error has occurred with the server' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
