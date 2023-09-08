/**
 * SERVER.JS
 * ================================================================
 * Keeping the code related to the server on server.js.
 * Keeping the code related to express on app.js.
 *
 * This is the entry point for the application
 *
 * Code related to environment (Development or Production) goes here.
 * Environment variables are outside the scope of express; so they go here, not app.js.
 * 
 * 
 * Required
 * --------
 * app
 *  - from app.js
 * 
 * Exports
 * -------
 * N/A
 */

/* ===========================================================================
    REQUIREMENTS / VARIABLES
=========================================================================== */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//=== Run dotenv.config() IMMEDIATELY after requiring; this will allow us to read config.env
dotenv.config({ path: `${__dirname}/config.env` });

const app = require('./app');





/* ===========================================================================
    DATABASE & MONGOOSE CONFIGURATION
=========================================================================== */
/**
 * Using mongoose to connect mongo db to the application.
 * Replace <PASSWORD> in DB string from env file with the actual password.
 * Object of options passed in mongoose.connect() is to deal with deprication warnings.
 * - Use exactly the same settings object when creating my own application.
 * connect() method returns a promise.
 * The promise returned by mongoose.connect() returns a connection object (con).
 */
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
.then((/* connect */) => {
  // console.log('connect:', connect);
  console.log('DB connection successful.');
});





/* ===========================================================================
    START SERVER / LISTENING FOR REQUESTS
=========================================================================== */
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`istening on port ${port}...`);
});