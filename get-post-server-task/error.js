const messages = {
  400: 'Bad request',
  404: 'Not found',
  409: 'File already exist',
  413: 'File size more than 1Mb',
  500: 'Server Error',
  502: 'Not implemented'
};

module.exports = (res, status, message) => {

  if (!status) {
    status = 500;
  }

  if (messages[status] && !message) {
    message = messages[status];
  }

  res.statusCode = status;
  res.end(message);
};