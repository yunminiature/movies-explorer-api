const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');
const linkRegex = require('../utils/constants');

const movieRouter = express.Router();

movieRouter.get('', getMovies);
movieRouter.post('', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(linkRegex).required(),
    trailer: Joi.string().regex(linkRegex).required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().regex(linkRegex).required(),
    movieId: Joi.number().required(),
  }),
}), createMovie);
movieRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = movieRouter;
