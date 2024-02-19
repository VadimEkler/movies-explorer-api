const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле не может быть пустым!'],
  },
  director: {
    type: String,
    required: [true, 'Поле не может быть пустым!'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле не может быть пустым!'],
  },
  year: {
    type: String,
    required: [true, 'Поле не может быть пустым!'],
  },
  description: {
    type: String,
    required: [true, 'Поле не может быть пустым!'],
  },
  image: {
    type: String,
    required: [true, 'Поле не может быть пустым!'],
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: 'Некорректный URL!',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Поле не может быть пустым!'],
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: 'Некорректный URL!',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле не может быть пустым!'],
    validate: {
      validator(url) {
        return validator.isURL(url);
      },
      message: 'Некорректный URL!',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле не может быть пустым!'],
  },
  movieId: {
    type: Number,
    required: [true, 'Поле не может быть пустым!'],
  },
  nameRU: {
    type: String,
    required: [true, 'Поле не может быть пустым!'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле не может быть пустым!'],
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
