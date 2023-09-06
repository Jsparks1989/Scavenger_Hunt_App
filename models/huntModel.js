/***
 * BUSINESS LOGIC
 * FAT MODELS - OFFLOAD AS MUCH LOGIC AS POSSIBLE INTO THE MODELS
 */

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
const slugify = require('slugify');

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
  slug: String,
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


/* ===========================================================================
    VIRTUAL PROPERTIES
=========================================================================== */
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
    MONGOOSE MIDDLEWARE
=========================================================================== */
/* ======================================================================================================
  Mongoose also has the concept of MW.
  ====================================
  - There are four TYPES of middleware in Mongoose:
    - document, query, aggregate, and model middleware.

  - Going to work with document MW first.
    - Which is middleware that can act on the currently processed document.

  - just like the virtual properties, we define a middleware on the schema, using tourSchema.pre().
    - this is for pre middleware, which again, is gonna run before an actual event, like the save event.
    - the callback function is called before an actual document is saved to the DB.
    - Ex. tourSchema.pre('event_name', callback_function())

  - And so this is for pre middleware, which again, is gonna run before an actual event.

  - We can have multiple pre middlewares or also post middlewares for the same hook. 
    - And hook is what 'save' is in the MW params.
    - So this middleware here is basically what we call a pre save hook.
====================================================================================================== */
/**
 * Document type MW in Mongoose.
 * -----------------------------
 * This is a pre save hook || pre save middleware.
 * Is ran before (pre) an actual document is saved to the DB.
 * Runs BEFORE .save() and .create().
 * Will NOT run with .insertMany().
 * 'this' is bound to the currently processed document.
 * The result from the callback should be present in the document once saved since its taking place before being saved.
 * ----------------------------------------------------------------
 * 1. Create a new property 'slug' on the current document using slugify and make it the document's name and make it lowercase.
 *   A slug is just a string that we can put in the URL, usually based on some string like the name.
 * 2. Need to add 'slug' field to the schema or else it wont work.
 */
huntSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });

  next();
});

/**
 * Document Type Post MW in Mongoose
 * ---------------------------------
 * This is a post save hook || post save middleware.
 * Bc its a Post MW, we will have access to next AND the just saved document.
 * Post MW functions run after all the Pre MW functions have completed.
 */
huntSchema.post('save', function(doc, next) {
  console.log('This is the document POST being saved to the DB:', doc);

  next();
});

/* ===========================================================================
    MODEL
=========================================================================== */
const Hunt = mongoose.model('Hunt', huntSchema);



/* ===========================================================================
    EXPORT
=========================================================================== */
module.exports = Hunt;