/**
 * AppError Class for handling errors.
 * ===================================
 * Objects created by this class will have: 
 *   - error message.
 *   - error status code.
 *   - error status.
 *   - isOperational.
 * 
 * When we need a new operational error thrown, we create a new object from this class
 *   and pass in the error message we want and the status code (400, 404, 500, etc.).
 * The error object will have: 
 *   - the error message,
 *   - the error status code,
 *   - the error status, 
 *   - and a bool value to show this is an operational error.
 * 
 * 
 * This class extends Express's built-in error class (new Error('custom_message')).
 *
 * Operational Errors are errors we can predict will happen at some point,
 *   so we need to handle them in advance.
 *   Ex. invalid user input, invalid path accessed, failed to connect to server or database, etc..
 *
 * Programming Errors are errors that we developers introduce into our code.
 *   Ex. Reading properties pon undefined, using await without sync, passing an int where an object is expected, etc..
 *
 * This class will be used to build all the operational errors in the app.
 *
 * What we want to pass into a new AppError Object created from this class is 'message' and 'statusCode'.
 *   We are passing these two properties in to the constructor bc the constructor is called when making a new object.
 *   Ex. const newAppErrorObj = new AppError(message, statusCode);
 *
 * We pass in 'message' into the super since this is the only parameter that the built-in error accepts.
 * 
 * Status Codes and Statuses: 
 *   Errors with status codes that are 4XX, their status is 'fail'.
 *   Errors with status codes that are 5XX, their status is 'error'.
 *
 * this.status can either be 'fail' or 'error'.
 *   If the this.statusCode starts with 4, then this.status === 'fail'.
 *   If the this.statusCode starts with 5, then this.status === 'error'.
 *   Use String.startsWith() for solution.
 *
 * this.isOperational = true, so we know the error is an operational error.
 * Any other errors that occur will not have this.isOperational property.
 *
 * Also need to capture the stack trace so we know where the error happened.
 *   Error.captureStackTrace(the_current_object, the_AppError_class_itself);
 * This way, when a new object is created, and a constructor function is called,
 *   the that function call will not appear in the stack trace.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    //--- Capture the call stack trace and remove the function call from the call stack.
    Error.captureStackTrace(this, this.constructor);

  }
}


/* ===========================================================================
    EXPORTS
=========================================================================== */
module.exports = AppError;