const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const HASH_SALT = 10;

module.exports = { URL_REGEX, MONGO_DUPLICATE_ERROR_CODE, HASH_SALT };
