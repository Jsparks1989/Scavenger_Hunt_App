/**
 * HUNTMODEL.JS
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
 * Hunt model
 */

/* ===========================================================================
    REQUIRED
=========================================================================== */
const mongoose = require('mongoose');

/* ===========================================================================
    SCHEMA
=========================================================================== */
/**
 * The hunt Schema includes:
 * title - the title of the scavenger hunt (SH)
 * description - description of the SH
 * items - array of all the items in the SH
 * startDate - when the SH begins
 * endDate - when the SH ends
 * createdBy - who created the SH
 * participants - array of all the participants.
 * 
 */ 
const huntSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true,'A hunt must have a name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'A hunt must have a description'],
    trim: true,
  },
  items: [
    {
      name: {
        type: String,
        required: [true, 'An item must have a name'],
      },
      clue: {
        type: String,
        required: [true, 'An item must have a clue'],
      },
      image: {
        type: String,
        default: 'image',
      },
      completed: {
        type: Boolean,
        default: false
      }
    }
  ],
  startDate: {
    type: Date,
    required: [true, 'A hunt must have a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'A hunt must have an end date'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    // required: [true, 'A hunt must include who created it'],
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Reference to the User model
    }
  ]
});




/* ===========================================================================
    MODEL
=========================================================================== */
const Hunt = mongoose.model('Hunt', huntSchema);



/* ===========================================================================
    EXPORT
=========================================================================== */
module.exports = Hunt;