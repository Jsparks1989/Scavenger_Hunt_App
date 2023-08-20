/**
 * USERMODEL.JS
 * ================================================================
 * FAT MODELS - OFFLOAD AS MUCH LOGIC AS POSSIBLE INTO THE MODELS
 * BUSINESS LOGIC - Include all code that actually solves the business problem we set out to solve.
 *  - Directly related to business rules, how the business works, and business needs.
 * 
 * Using Mongoose ODM to create schemas and models for database.
 * Schema - used to define the structure, data types, and validation rules for the data that will be stored in a MongoDB collection. 
 *  - It acts as a blueprint for creating documents in the collection.
 * Model - provides an interface to perform operations on the database like query, create, update, delete, etc.
 *  - We create the model from the schema (Need the schema in order to have the model).
 * ---------------------------------------------------------------------------------
 * Schema
 * ======
 * Initialize a new instance of the Mongoose Schema with 'new mongoose.Schema()'.
 * We pass in our schema as an object. mongoose.Schema({Schema_Object})
 * We use Schema Type Options to define fields even further.
 * ---------------------------------------------------------------------------------
 * Model
 * =====
 * mongoose.model('Name_of_model', the_schema);
 * ---------------------------------------------------------------------------------
 * 
 * Required
 * --------
 * mongoose
 * 
 * Exports
 * -------
 * User model
 */

/* ===========================================================================
    REQUIRED
=========================================================================== */
const mongoose = require('mongoose');

/* ===========================================================================
    SCHEMA
=========================================================================== */
/**
 * The user Schema includes:
 * username - the user's username 
 * email - the user's email
 * password - the user's password
 * createdAt - when the user was created
 * hunts - array of all the SHs the user is a part of
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A user must have a username'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hunts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hunt',
    },
  ],
});



/* ===========================================================================
    MODEL
=========================================================================== */
const User = mongoose.model('User', userSchema);



/* ===========================================================================
    EXPORT
=========================================================================== */
module.exports = User;