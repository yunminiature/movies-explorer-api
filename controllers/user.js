const mongoose = require('mongoose');
const User = require('../models/user');
const DataError = require('../errors/400');
const NotFoundError = require('../errors/404');
const AlreadyExistsError = require('../errors/409');

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(new NotFoundError('Пользователь не найден'));
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      next(new NotFoundError('Пользователь не найден'));
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new DataError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new AlreadyExistsError('Пользователь с данным E-mail уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUser,
  updateUser,
};
