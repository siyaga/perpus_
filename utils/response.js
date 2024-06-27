const sendApiResponse = (res, page, limit, count, data, message, status) => {
  res.status(status).json({
    data,
    page,
    limit,
    count,
    message,
    status,
  });
};

module.exports = sendApiResponse;
