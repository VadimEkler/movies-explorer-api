const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const{ MONGO_DUPLICATE_ERROR_CODE, HASH_SALT } = require('../utils/constants')

const { SECRET_KEY } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, HASH_SALT)
    .then((hash) => User.create({
      email, password: hash, name,
    })
      .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send({
        email: user.email, name: user.name, _id: user._id,
      }))
      .catch((err) => {
        if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
          next(new ConflictError('Пользователь с данным E-mail уже зарегистрирован!'));
        } else if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError(err.message));
        } else {
          next(err);
        }
      }));
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send({
      email: user.email, name: user.name,
    }))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send({
      email: user.email, name: user.name,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь c указанным id не найден!'));
      } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с данным E-mail уже зарегистрирован!'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '30m' });
      res.status(httpConstants.HTTP_STATUS_OK).send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
