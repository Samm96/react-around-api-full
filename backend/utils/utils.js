const SUCCESS_MSG = 201;

// CORS
const allowedCors = [
  'https://samantha-horsch-around-us.students.nomoredomainssbs.ru',
  'https://api.samantha-horsch-around-us.students.nomoredomainssbs.ru',
  'https://www.samantha-horsch-around-us.students.nomoredomainssbs.ru',

];
const DEFAULT_ALLOWED_METHODS = 'GET, HEAD, PUT, PATCH, POST, DELETE';

module.exports = {
  SUCCESS_MSG,
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};
