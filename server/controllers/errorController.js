const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} with value ${err.value}`;
  return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `${value} is taken. Please use another one.`;
  return new AppError(message, 404);
}

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
}

const handleJWTError = err => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpires = err => new AppError('Token is expired. Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
    // RENDERED WEBSITE
  } else {
  }
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    //Operational, trusted errors: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
      // programming or other unknown errors: don't send message to client
    } else {
      // 1) Log error
      console.error('error 🧨', err);
      // 2) Send message
      return res.status(500).json({
        status: 'Error',
        message: 'Someting went very wrong'
      });
    }

    // RENDERED WEBSITE
  }
  if (err.isOperational) {
    // programming or other unknown errors: don:t send message to client
  } else {
    // 1) Log error
    console.error('error 🧨', err);
    // 2) Send message
  }
};


module.exports = (err, req, res, next) => {
  /* console.log(err.stack); */
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError') error = handleJWTExpires(error);

    sendErrorProd(error, req, res);
  }
};