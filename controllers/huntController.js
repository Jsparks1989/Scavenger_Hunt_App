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
const APIFeatures = require('../utils/apiFeatures');




/* ===========================================================================
    CONTROLLER FUNCTIONS
=========================================================================== */
/**
 * Gets all the Hunt documents based on the fields in the req.query.
 * 
 * Uses the APIFeatures class to build the query for Hunt documents.
 *   The APIFeatures class takes a query object and req.query as params,
 *   each of the methods chains a query object function to the query object passed in as a param.
 * ---------------------------------------------------------------------------------------------------------------------
 * 1. Build the query.
 *   Instantiate a new APIFeature object and pass a query object (Tour.find()) and the query string (req.query) as params.
 *   Will chain the APIFeature methods to the new instantiated object.
 *   Each of the methods will chain a helper function to this.query (the query object passed in as a param; Tour.find()).
 * 
 * 2. Execute the query. 
 *   Create 'tours' variable and set it to await the execution of the APIFeature object query.
 *   Execute the query using await.
 * 
 * 3. Send response.
 */
exports.getAllHunts = async (req, res) => {
  try {
    console.log('req.query:', req.query);

    // BUILD THE QUERY
    /////////////////////////////////
    const features = new APIFeatures(Hunt.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // EXECUTE THE QUERY
    /////////////////////////////////
    const hunts = await features.query;

    // SEND RESPONSE
    /////////////////////////////////
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

/* ===========================================================================
    AGGREGATE PIPELINE FUNCTIONS
=========================================================================== */
/* ======================================================================================================================
  Data Aggregation - Data aggregators summarize data from multiple sources.

  Aggegation Pipeline - A defined pipeline that all documents from a certain collection go through where they are
    processedstep by step in order to transform them into aggregated results.
    
    Ex. We can use the aggregation pipeline in order to calculate averages or calculating minimum and maximum values
      or we can calculate distances.

  The MongoDB aggregation pipeline is a powerful and flexible framework for processing and transforming data within a MongoDB database. 
    It allows you to perform complex data manipulation operations on documents stored in a collection, 
    such as filtering, grouping, sorting, and projecting fields. 
    The aggregation pipeline consists of a series of stages that you can use to process and reshape your data.

  Each stage in the aggregation pipeline performs a specific operation on the documents as they pass through the pipeline, 
    and the results of one stage become the input for the next stage.
====================================================================================================================== */
/**
 * Aggregate Pipeline function for getting stats for Hunt docs
 * -----------------------------------------------------------
 * ---> Come back to using aggregate pipelines later. I could use them for showing average number of wins or completes etc. based on players and/or difficulty.
 */
exports.getHuntStats = async (req, res) => {
  try {
    // BUILD & EXECUTE THE QUERY
    //////////////////////////////
    const stats = await Hunt.aggregate([
      {
        $match: { completed: false }
      },
    ]);
    console.log('stats');

    // SEND RESPONSE
    ///////////////////////
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      }
    }); 


  } catch(err) {
    res.status(400).json({
      status: 'error',
      data: err
    }); 
  }
}