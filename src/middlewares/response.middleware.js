// Correcto
export const responseMiddleware = (req, res, next) => {
  res.success = (message, data = {}) => {
    res.status(200).json({
      status: "success",
      message,
      data
    });
  };

  res.created = (message, data = {}) => {
    res.status(201).json({
      status: "success",
      message,
      data
    });
  };

  res.error = (message, statusCode = 500, extra = {}) => {
    res.status(statusCode).json({
      status: "error",
      message,
      ...extra
    });
  };

  next();
};