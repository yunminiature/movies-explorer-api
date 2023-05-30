const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const DataError = require('../errors/400');
const AlreadyExistsError = require('../errors/409');

const { NODE_ENV, JWT_SECRET } = process.env;

const signUp = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({ email, password: hash, name });
    })
    .then(() => {
      res.status(201).send({ email, name });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new DataError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new AlreadyExistsError('Пользователь с данным E-mail уже существует'));
      } else {
        next(err);
      }
    });
};

const signIn = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send(token);
    })
    .catch(next);
};

module.exports = {
  signUp,
  signIn,
};
