const router = require('express').Router();
const { cors } = require('cors');

const auth = require('../middleware/auth');

const NotFoundError = require('../errors/NotFoundError');

const cardsRouter = require('./cards');
const usersRouter = require('./users');

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
