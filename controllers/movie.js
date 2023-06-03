const mongoose = require('mongoose');
const Movie = require('../models/movie');
const DataError = require('../errors/400');
const ForbiddenError = require('../errors/403');
const NotFoundError = require('../errors/404');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(201).send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new DataError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params.movieId })
    .orFail(() => {
      next(new NotFoundError('Фильм не найден'));
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new ForbiddenError('Недостаточно прав пользователя'));
      } else {
        movie.deleteOne()
          .then(() => res.send(movie))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new DataError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
