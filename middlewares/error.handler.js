/**
 * @module errorHandlers
 * Middleware functions for logging and handling different types of errors
 * in an Express application.
 */

const { ValidationError } = require('sequelize');
const boom = require('@hapi/boom');

/**
 * Logs the full error stack to the console and passes control to the next error handler.
 *
 * @param {Error}   err  - The error object caught by Express.
 * @param {Request} req  - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 */
function logErrors(err, req, res, next) {
  console.error(err);
  next(err);
}

/**
 * Catches any error not handled by previous middlewares and sends a 500 response
 * with the error message and stack trace.
 *
 * @param {Error}   err  - The error object.
 * @param {Request} req  - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 */
function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

/**
 * Handles Boom errors (HTTP-friendly error objects).
 * If the error is a Boom error, responds with the Boom-generated status and payload.
 * Otherwise, passes control to the next error handler.
 *
 * @param {Error|boom.Boom} err  - The error object, possibly a Boom error.
 * @param {Request}         req  - The Express request object.
 * @param {Response}        res  - The Express response object.
 * @param {Function}        next - The next middleware function in the chain.
 */
function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  } else {
    next(err);
  }
}

/**
 * Handles Sequelize ORM validation errors.
 * If the error is an instance of Sequelize.ValidationError, responds with 409 Conflict
 * and details of the validation failures. Otherwise, passes control onward.
 *
 * @param {Error}   err  - The error object, possibly a Sequelize ValidationError.
 * @param {Request} req  - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 */
function ormErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.errors,
    });
  } else {
    next(err);
  }
}

module.exports = {
  logErrors,
  errorHandler,
  boomErrorHandler,
  ormErrorHandler,
};
