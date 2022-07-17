const Card = require('../models/card');
const ForbiddenError = require('../errors/ForbiddenError');
const InternalServerError = require('../errors/InternalServerError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const CastError = require('../errors/CastError');
const { SUCCESS_MSG } = require('../utils/utils');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      next(new InternalServerError('An error has occurred with the server'));
    });
};

const createCard = (req, res, next) => {
  console.log(req.user._id); // _id will become accessible (this is hardcoded)
  // Project: "We've hardcoded the user ID, so the card will have the same author in the database
  // regardless of who actually created it."

  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(new InternalServerError('An error has occurred with the server'));
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const currentUserId = req.user._id;

  Card.findById(cardId)
    .orFail(new NotFoundError('Card ID not found'))
    .then((card) => {
      if (card.owner.toString() !== currentUserId) {
        next(new ForbiddenError('Cannot delete another user\'s card'));
      }
      Card.findByIdAndRemove(cardId)
        .orFail(new NotFoundError('Card ID not found'))
        .then(() => res.status(SUCCESS_MSG).send(card && { message: 'Card deleted successfully' }))
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
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
        next(new CastError('Card ID not valid'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Card ID not found'));
      } else {
        next(new InternalServerError('An error has occurred with the server'));
      }
    });
};

const dislikeCard = (req, res, next) => {
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
        next(new CastError('Card ID not valid'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Card ID not found'));
      } else {
        next(new InternalServerError('An error has occurred with the server'));
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
