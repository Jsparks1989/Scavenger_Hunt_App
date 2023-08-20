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
    ROUTES
=========================================================================== */
app.use('/api/v1/users', userRouter);
app.use('/api/v1/scavhunt', huntRouter);


/* ===========================================================================
    EXPORTS
=========================================================================== */
module.exports = app;

