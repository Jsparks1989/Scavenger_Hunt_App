/**
 * APP.JS
 * ================================================================
 * Keeping the code related to express on app.js.
 *
 * Required
 * --------
 * userRouter
 *  - from routes/userRouter.js
 * scavhuntRouter
 *  - from routes/scavhuntRouter.js
 * 
 * Exports
 * -------
 * app
 *  - imported by server.js
 * 
 */

/* ===========================================================================
    REQUIREMENTS / VARIABLES
=========================================================================== */
const express = require('express');
const userRouter = require('./routes/userRoutes');
const huntRouter = require('./routes/huntRoutes');
const morgan = require('morgan');


const app = express();





/* ===========================================================================
    GLOBAL MIDDLEWARES
=========================================================================== */
//=== If in development mode, use morgan to see data on requests
if(process.env.NODE_ENV === 'development') {
  // console.log(process.env.NODE_ENV);
  app.use(morgan('dev'));
}

//=== Use parser to get data from POST requests
app.use(express.json());
// app.use(bodyParser.json());


//=== Access static files like in public directory
// app.use(express.static(public_directory)); 


/* ===========================================================================
    GLOBAL MW FOR ROUTES
=========================================================================== */
/**
 * Mount the imported routers for tours and users to the app.
 * ----------------------------------------------------------
 * Define the 'root' path for each resource and use the router as the middleware function.
 */
app.use('/api/v1/users', userRouter);
app.use('/api/v1/scavhunt', huntRouter);

/**
 * MW to catch any unhandled routes.
 * ---------------------------------
 * This MW needs to come after all other route MW so we catch the unhandled routes.
 *
 * We want to handle ALL the unhandled routes & HTTP methods (GET, POST, DELETE, PATCH, etc.).
 * 
 * When an unhandled route is encountered, an err is passed in through next() and will trigger the error handling MW.
 */
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err);
});

/* ===========================================================================
    GLOBAL MW FOR ROUTES
=========================================================================== */
/**
 * Global Express error handling.
 * ------------------------------
 * Express has built-in error handling.
 *
 * Catch all the errors coming from all over the app.
 *   Ex. Errors from route handler, model validator, etc.
 *
 * Goal is to have all these errors end up in this central error handling MW.
 *
 * If the MW function has 4 arguments, Express will recognize it as an error handling MW.
 *   Therefore it will only be called if theres an error.
 *   Err first function.
 *
 * When creating an error in a MW, need to pass the error as an argument in to next().
 *   Express will know its an error when an argument is passed in to next().
 */
app.use((err, req, res, next) => {
  //--- Define a default status code & status if neither are already defined in the err object.
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
    middleware: 'Error Handling',
  });
  
  next();
});

/* ===========================================================================
    EXPORTS
=========================================================================== */
module.exports = app;

