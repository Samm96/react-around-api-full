const SUCCESS_MSG = 201;

// CORS
const allowedCors = [
  'https://api.samantha-horsch-around-us.students.nomoredomainssbs.ru',
  'https://www.samantha-horsch-around-us.students.nomoredomainssbs.ru',
  'https://samantha-horsch-around-us.students.nomoredomainssbs.ru',
  'localhost:3000',
];
const DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';

module.exports = {
  allowedCors,
  SUCCESS_MSG,
  DEFAULT_ALLOWED_METHODS,
};
