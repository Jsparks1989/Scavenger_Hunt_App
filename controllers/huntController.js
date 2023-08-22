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
    CONTROLLER FUNCTIONS
=========================================================================== */
/**
 * Getting all the Hunt documents
 * ------------------------------
 * BUILD THE QUERY
 * ---------------
 * 1. Make a hard copy of req.query (dont want to affect the original query)
 *   so we can remove exculuded fields and handle them separately.
 *
 * 2. Remove the excluded fields from the query copy.
 *   foreach will return the same queryObj with all excluded fields removed.
 * -------------------------------------------------------------------------------------------
 * BASIC FILTERING QUERIES
 * -----------------------
 * 1. After query copy has excluded fields removed, we can run basic filtering with Model.find().
 *   Run it after advanced filtering has been handled.
 * Ex. 127.0.0.1:3000/api/v1/scavhunt?difficulty=easy
 * -------------------------------------------------------------------------------------------
 * ADVANCED FILTERING QUERIES
 * --------------------------
 * Advanced filtering involves using operators, not just parameters.
 * Ex. 127.0.0.1:3000/api/v1/scavhunt?numOfPlayers[gte]=10
 * 
 * MongoDB advanced filtering operators
 *   $gt (greaterThan) || $gte (greaterThanOrEqualTo) || $eq (equalTo) || $lt (lessThan) || $lte (lessThanOrEqualTo)
 * 
 * req.query -> { difficulty: 'easy', duration: { gte: '5' } }
 * mongoDB query -> { difficulty: 'easy', duration: {$gte: 5} }
 * 
 * 1. Need to stringify the query so 'gt', 'gte', 'eq', 'lt', and 'lte' and be replaced with mongoDB operators using RegEx.
 *   String.replace() returns a new string.
 * 
 * 2. After replacing the filter operators with mongoDB filter operators, need to convert query back to an object.
 * 
 * 3. Then chain the Query.find() method to the query.
 * -------------------------------------------------------------------------------------------
 * SORTING
 * -------
 * Sort return results in ascending/descending order based on certain fields
 *   Ex. 127.0.0.1:3000/api/v1/scavhunt?sort=numOfPlayers (sort in ascending order)
 *   Ex. 127.0.0.1:3000/api/v1/scavhunt?sort=-numOfPlayers (sort in descending order)
 * 
 * In instances when sorting and there are multiple items with the same value,
 *   we can add a second field name to sort as a second criteria.
 *   Ex. 127.0.0.1:3000/api/v1/scavhunt?sort=numOfPlayers,numOfItems
 * 
 * 1. Check if sort is a property in the req.query object.
 *
 * 2. Create new variable (sortBy) thats set to req.query.sort split by comma and join them with a space.
 *
 * 3. Chain select(sortBy) to the query.
 *
 * 4. Create a default sort in the else clause.
 *   Will return all documents in a descending order by the createdAt field.
 * -------------------------------------------------------------------------------------------
 * FIELD LIMITING
 * --------------
 * The client chooses which fields they can get back in response.
 *   Ex. 127.0.0.1:3000/api/v1/scavhunt?fields=title,description,difficulty,completed
 *     Only receiving the fileds specified by 'field' variable.
 *   Ex. 127.0.0.1:3000/api/v1/scavhunt?fields=-__v
 *     The - means we want to exclude the field, not include it.
 *
 * Its best practices to limit the amount of data returned so we limit the use of bandwidth.
 *
 * We can also limit what fields are returned from the query in the Schema with the 'select' property.
 *
 * 1. Check if 'field' is in req.query.
 *     
 * 2. Then create new variable (fields) set to separate the fields by comma and join with a space.
 *   Ex. req.query.fields.split(',').join(' ');
 * 
 * 3. Then chain select(fields) to the query.
 *
 * 4. Create a default field limit in the else clause.
 *   Want to return all the fields EXCEPT the '__v' field.
 * -------------------------------------------------------------------------------------------
 * PAGINATION
 * ----------
 * Figures out the number of pages to return results and how many results on each page.
 *   Ex. 127.0.0.1:3000/api/v1/scavhunt?page=2&limit=10
 * 
 * ?page=2&limit=10
 * query = query.skip(10).limit(10);
 * Use the skip() and limit() methods when the user chooses a certain page.
 *   If the limit of results for each page is 10, and the user wants to be on page 2,
 *   then we need to skip the first 10 results so we start with results 11-20.
 *   If the user wants page 5, then we need to skip the first 40 results and return 41-50.
 * 
 * If the user requests a page that doesnt exist bc theres not enough results to have the requested page,
 *   First make sure req.query.page exists,
 *   Then await for Model.countDocuments() method to return total amount of documents for the model.
 *   If the number of documents skipped is greater than or equal to total documents, then the page doesnt exist and throw an error.
 *
 * 1. Define variable for page value by multiplying req.query.page by 1 to convert the string to number.
 *   Use || to define default value.
 * 
 * 2. Define variable for limit values by multiplying req.query.limit by 1 to convert the string to number.
 *    Use || to define default value.
 * 
 * 3. Define the skip value by muliplying the previous page number by the limit.
 * 
 * 4. Chain skip(skip_var) and limit(limit_var) methods to the query.
 * 
 * 5. Check if req.query.page is true. (To make sure the user hasnt requested a page that doesnt exist)
 * 
 * 6. Then await Hunt.countDocuments() to return the total number of all Hunt documents and set to variable.
 * 
 * 7. Compare the number of skipped to the total number of Hunt documents
 * 
 * 8. If the number of skipped >= total Hunt documents, throw new error 'This page does not exist.' 
 *
 * -------------------------------------------------------------------------------------------
 * EXECUTE THE QUERY
 * -----------------
 * Only want to await when executing the query after all the chaining from basic/advanced filtering, sorting, field limiting, and pagination are added.
 */
exports.getAllHunts = async (req, res) => {
  try {
    console.log('req.query:', req.query);

    // BUILD THE QUERY & BASIC FILTERING
    /////////////////////////////////
    //=== Hard copy of req.query
    const queryObj = { ...req.query };

    //=== Excluded fields
    const excludedFields = ['page', 'limit', 'sort', 'fields'];

    //=== Remove excluded fields from the request query
    excludedFields.forEach((el) => delete queryObj[el]);


    // ADVANCED FILTERING
    /////////////////////////////////
    /*
      No Need for advanced filtering yet.
      No fileds to be used by advanced filtering yet

      1. Stringify queryObj and set to variable.
      2. Use RegEx to replace the filter operators in URL (gte, gt, lte, lt)
         with mongoDB filtering operators ($gte, $gt, $lte, $lt).
      3. Parse queryObj back to object.
      4. Create a query variable and set it equal to the Hunt model and chain find() to it with queryObj passed in as param.
        Ex. let query = Hunt.find(queryObj);

    */ 

    // SORTING
    /////////////////////////////////
    /*
      No Need for sorting yet.
      No fileds to be used for sorting yet

      1. Check if req.query.sort is true.
      2. In case there are multiple fields for sort, split() req.query.sort by comma and then join() with a space; set to variable.
        Ex. const sortBy = req.query.sort.split(',').join(' ');
      3. Chain Query.sort() to the query and pass sortBy in as param.
      4. Add default sorting in else clause
        Sort by createdAt in descending order.

     */ 

    // FIELD LIMITING
    /////////////////////////////////
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // PAGINATION
    /////////////////////////////////
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page -1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numHunts = await hunts.countDocuments();
      if (skip >= numHunts) throw new Error('This page does not exist');
    }


    // EXECUTE THE QUERY
    /////////////////////////////////
    const hunts = await query;

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