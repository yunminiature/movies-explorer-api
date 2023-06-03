const express = require('express');
const { celebrate, Joi } = require('celebrate');
const NotFoundError = require('../errors/404');
const {
  signUp,
  signIn,
} = require('../controllers/auth');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), signUp);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), signIn);
router.use(auth);
router.use('/users/me', userRouter);
router.use('/movies', movieRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
