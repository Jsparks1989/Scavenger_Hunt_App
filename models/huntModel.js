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
  difficulty: {
    type: String,
    required: [true, 'A hunt must have a difficulty'],
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
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
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
  ],
  completed: {
    type: Boolean,
    default: false
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the User model
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});


/*
  Virtual Properties
  ==================
  - Virtual properties are basically fields that we can define on our schema but that will not be persisted.
  - So they will not be saved into the database in order to save us some space there.
  - And most of the time, of course, we want to really save our data to the database,
    but virtual properties make a lot of sense for fields that can be derived from one another.
  - Ex. Conversion of miles to kilometers.
  - The virtual properties only show up in responses after we get the data required to create the virtual properties && we pass in options in the Schema.
    - Ex. const tourSchema = new mongoose.Schema({ Schema_definitions }, { Schema_options });
    - Schema options need to be { toJSON: { virtuals: true }, toObject: { virtuals: true } }
      - The options - The virtuals to be part of the output && The data to get outputted as an object.
  - CANNOT USE VIRTUAL PROPERTIES AS A QUERY. They are not part of the database.
*/
/**
 * Creating a virtual property.
 * Define the property with: tourSchema.virtual('property_name').
 * Define the get method with: get()
 *   The virtual property will be created each time that we get some data out of the database.
 *   So this get() function is called a getter.
 * 'this' points to the document.
 *
 * Knowing the duration in weeks is a Business Logic (goes in the model) since it has to do with the business itself.
 * It is not Application logic bc its got nothing to do with requests or responses.
 */
huntSchema.virtual('numOfParticipants').get(function() {
  return this.participants.length;
});

huntSchema.virtual('numOfItems').get(function() {
  return this.items.length;
});



/* ===========================================================================
    MODEL
=========================================================================== */
const Hunt = mongoose.model('Hunt', huntSchema);



/* ===========================================================================
    EXPORT
=========================================================================== */
module.exports = Hunt;