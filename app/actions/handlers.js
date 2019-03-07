function successHandler(res, data) {
  const response = {
    success: true,
    content: data
  };
  return res.json(response);
}

function errorHandler(res, msg, status) {
  const response = {
    success: false,
    content: msg
  };
  return res.status(status).json(response);
}

module.exports = {
  successHandler,
  errorHandler
};
