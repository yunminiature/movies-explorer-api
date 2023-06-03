const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/401');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле "E-mail" не может быть пустым'],
    unique: [true, 'Данный E-mail уже используется'],
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Введён некорректный E-mail',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле "Пароль" не может быть пустым'],
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'Поле "Имя" слишком короткое, введите от 2 до 30 символов'],
    maxlength: [30, 'Поле "Имя" слишком длинное, введите от 2 до 30 символов'],
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неверные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неверные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
