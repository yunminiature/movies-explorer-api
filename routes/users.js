const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  updateUser,
} = require('../controllers/user');

const userRouter = express.Router();

userRouter.get('', getUser);
userRouter.patch('', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

module.exports = userRouter;
