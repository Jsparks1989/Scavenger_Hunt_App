/**
 * SCAVHUNTCONTROLLER.JS
 * ================================================================
 * - Application Logic (Code that is only concerned about the application's implementation, not the underlying business problem we're trying to solve (ex. showing and selling tours).)
 * - Lean Controllers- Keep the controllers as simple and lean as possible.
 * 
 * Using async/await in many if the controller functions.
 *   This is bc it can take time for the Model methods to interact with the database.
 * Model methods, (find, findById, etc.) return a Query. This is why we can chain Query helper methods to them.
 *   Model methods are also included in Query.prototype.
 * Using Query object helper methods (where(), equals(), etc.) chained on the Model instance static methods ( find(), findById(), findOne()), dont need to instantiate a Query obj.
 *   Can chain the Query helper methods onto the Model methods.
 *   We can do this because many of the Model methods return a Query obj.
 * 
 * Required
 * --------
 * Hunt model
 * 
 * 
 * Exports
 * -------
 * Each Controller will be exported.
 *  - imported by routes/huntRoutes.js
 * 
 */
/* ===========================================================================
    REQUIRED
=========================================================================== */
const Hunt = require('../models/huntModel');






/* ===========================================================================
    GLOBAL VALUES/VARIABLES
=========================================================================== */
/**
 * An array of fields we want to exclude from queries.
 * These fields will be handled elsewhere || later on.
 * 
 */
const excludedFields = ['page', 'sort', 'limit', 'fields'];





/* ===========================================================================
    CONTROLLER FUNCTIONS
=========================================================================== */
/**
 * Getting all the Hunt documents
 * ------------------------------
 * Using try/catch & async/await bc we're using Model methods.
 * Need to await the return of the query for all Hunt documents AND await 
 * 
 */
exports.getAllHunts = async (req, res) => {
  try {

    // console.log(req.query);
    // BUILD THE QUERY
    //////////////////////////////
    //=== Need hard copy of the request query (Dont want to alter the original query by making a soft copy).
    const queryObj = { ...req.query };

    //=== Remove excluded fields from the request query
    excludedFields.forEach((el) => delete queryObj[el]);


    // EXECUTE THE QUERY
    //////////////////////////////
    /**
     * Need to first await the return of the Query with all Hunts.
     * Passing in the query object to the Model method find().
     */ 
    const query = await Hunt.find(queryObj);

    /**
     * After we get the Query object with all the hunts, we need to await again so we can run queries with the excluded fields.
     * The URL for getting all Hunts might include other parameters (page, sort, limit, ect.).
     * We need to await the return of the Query with all Hunts...
     *  THEN we need to await the return with all the excluded fields (parameters) applied.
     */
    const hunts = await query;

    // SEND RESPONSE
    //////////////////////////////
    res.status(200).json({
      status: 'success',
      data: {
        hunts: hunts,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
  
}

/**
 * Getting certain Hunt document by id
 * -----------------------------------
 * Returns a Hunt based on the id passed through the URL.
 * The id parameter is defined by the route Router.route('/:id')
 */
exports.getHunt = async (req, res) => {
  try {
    // BUILD & EXECUTE THE QUERY
    //////////////////////////////
    const hunt = await Hunt.findById(req.params.id);


    // SEND RESPONSE
    //////////////////////////////
    res.status(200).json({
      status: 'success',
      data: hunt
    }); 
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err
    }); 
  }
  
}

/**
 * Create new Hunt document
 * ------------------------
 * New hunt request is coming from POST body.
 * Using the Model method create() to create a new hunt document.
 * Use try/catch bc async/await.
 * 201 - request was successfully fulfilled and resulted in one or possibly multiple new resources being created.
 */
exports.createHunt = async (req, res) => {
  try {
    // console.log(req.body);
    // CREATE NEW HUNT DOCUMENT
    //////////////////////////////
    const newHunt = await Hunt.create(req.body);

    // SEND RESPONSE
    //////////////////////////////
    res.status(201).json({
      status: 'success',
      data: newHunt,
    }); 
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err
    }); 
  }
  
}

/**
 * Update a current Hunt document
 * ------------------------------
 * Querying for a specific Hunt document based on id param in URL.
 * The id param is defined in the routes (Router.route('/:id')).
 * Model.findByIdAndUpdate() will get the Hunt document with the param id, 
 *   update it with the data in the req.body, 
 *   and return a new document and run the validators (as defined in the schema) against the new document.
 */
exports.updateHunt = async (req, res) => {
  try {
    // BUILD & EXECUTE THE QUERY
    //////////////////////////////
    const hunt = await Hunt.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // SEND RESPONSE
    //////////////////////////////
    res.status(200).json({
      status: 'success',
      data: hunt
    }); 
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err
    }); 
  }
  
}

/**
 * Deleting a current Hunt document
 * --------------------------------
 * Querying for a specific Hunt document based on id param in URL and Deleting it.
 * The id param is defined in the routes (Router.route('/:id')).
 * Model.findByIdAndDelete() will get the Hunt document with the param id and delete it.
 */
exports.deleteHunt = async (req, res) => {
  try {
    // BUILD & EXECUTE THE QUERY
    //////////////////////////////
    const hunt = await Hunt.findByIdAndDelete(req.params.id);

    // SEND RESPONSE
    ///////////////////////
    res.status(200).json({
      status: 'success',
      data: null
    }); 
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err
    }); 
  }
  
}