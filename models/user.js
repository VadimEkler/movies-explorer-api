const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnathorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле не может быть пустым!'],
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Некорректный E-mail!',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле не может быть пустым!'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Поле не может быть пустым!'],
    minlength: [2, 'Минимальная длина поля - 2 символа!'],
    maxlength: [30, 'Максимальная длина поля - 30 символов!'],
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnathorizedError('Пользователь с данным E-mail не найден!');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnathorizedError('Неправильные почта или пароль!');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
