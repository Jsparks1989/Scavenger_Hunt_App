/***
 * APPLICATION LOGIC
 * LEAN CONTROLLERS - KEEP THE CONTROLLERS AS SIMPLE AND LEAN AS POSSIBLE
 *
 * Controllers are usually based on resources.
 *
 * The errors controller.
 * ----------------------
 * This controller is for controlling our errors.
 * This controller is the global error handling function for the global error handling MW.
 */
/* ===========================================================================
    REQUIRE 
=========================================================================== */

/* ===========================================================================
    ERRORS CONTROLLER FUNCTIONS
=========================================================================== */
/**
 * Error handler function for Error Handling MW.
 * ---------------------------------------------
 * If the MW function has 4 arguments, Express will recognize it as an error handling MW.
 *   Therefore it will only be called if theres an error.
 *   Err first function.
 * 
 * This error handler function takes 'err' as an argument,
 *   the 'err' will be the AppError object passed in to next() from another MW.
 * 
 * If err is from AppError class (an operational error), it will have:
 *   - the error message,
 *   - the error status code,
 *   - the error status, 
 *   - and a bool value to show this is an operational error. 
 * 
 * In case err does not have these values, we must set defaults.
 */
module.exports = (err, req, res, next) => {
  // console.log('stack trace:', err.stack);

  // SET DEFAULT VALUES
  /////////////////////////////////
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // SEND RESPONSE
  /////////////////////////////////
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message
  });

  next();
}