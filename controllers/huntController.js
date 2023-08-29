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
    HELPER FUNCTIONS/CLASSES
=========================================================================== */
/**
 * Created a class for the API Features:
 *   filtering, sorting, field limiting, pagination, etc.
 * 
 * This class builds the query and will execute the query in the controller functions.
 *
 * Two Parameters:
 *   1. A query object (Tour.find() or User.find() since mongoose Model methods return query object).
 *     Need to pass a query object as a param so we can chain other query object helper functions to it by running methods from APIFeature object.
 *     By passing in a query object, we can chain other methods like sort() or find().
 *   2. req.query - the query string thats coming from express.
 * 
 * Inside the class, this.query is the query object.
 *   So in filter(), 'this.query = this.query.find(JSON.parse(queryStr));' is the same as 'Tour.find().find(JSON.parse(queryStr))'.
 *   This is acceptable bc we havent executed the query yet.
 *   We execute the query in the exported controller functions.
 *
 * Each of the methods will manipulate the query object and will add more methods to it.
 *   Each method will set this.query to the query that method needs to execute.
 *   Each method will also return 'this' so the methods can be chained when instantiating an APIFeature object.
 *
 * To execute the query, await APIFeature_object_variable_name.query.
 *   Ex. const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
 *       const tours = await features.query;
 */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // FILTER FUNCTIONALITY
  /////////////////////////////////
  /**
   * FILTERING QUERIES
   * -----------------------
   * Use Model.find() method for filtering.
   * 1. Make a hard copy of the query string
   *
   * 2. Make array of fields you dont want included in the query string.
   *    Excluded fields will be handled in another method.
   * 
   * 3. Need to stringify the query so 'gt', 'gte', 'eq', 'lt', and 'lte' and be replaced with mongoDB operators using RegEx.
   *
   * Advanced filtering involves using operators, not just parameters.
   *   Ex. 127.0.0.1:3000/api/v1/tours?limit[gte]=10
   *
   * MongoDB advanced filtering operators:
   *   $gt (greaterThan) || $gte (greaterThanOrEqualTo) || $eq (equalTo) || $lt (lessThan) || $lte (lessThanOrEqualTo)
   *   Ex. req.query -> { difficulty: 'easy', duration: { gte: '5' } }
   *       mongoDB query -> { difficulty: 'easy', duration: {$gte: 5} }
   *
   * 4. After replacing the filter operators with mongoDB filter operators, need to convert query back to an object with JSON.parse().
   *
   * 5. Then set this.query = this.query.find(JSON.parse(queryStr)).
   *    Need to chain find(JSON.parse(queryStr)) onto this.query. 
   * 
   * 6. return 'this' so we can chain the filter() method to the query when the query is being executed.
   */
  filter() {
    const queryObj = { ...this.queryString };
    console.log('hard copy queryObj:', queryObj);
    const excludedFields = ['page', 'limit', 'sort', 'fields'];

    excludedFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
  }

  // SORTING
  ////////////////////////////////
  /**
   * SORTING
   * -------
   * Sort return results in ascending/descending order based on certain fields
   *   Ex. 127.0.0.1:3000/api/v1/tours?sort=numOfPlayers (sort in ascending order)
   *   Ex. 127.0.0.1:3000/api/v1/tours?sort=-numOfPlayers (sort in descending order)
   *
   * In instances when sorting and there are multiple items with the same value,
   *   we can add a second field name to sort as a second criteria.
   *   Ex. 127.0.0.1:3000/api/v1/tours?sort=ratingsAverage,ratingsQuantity
   *
   * 1. Check if sort is a property in the this.queryString object.
   *
   * 2. Create sortBy variable and set to this.queryString.sort split by comma and join them with a space.
   *
   * 3. Chain 'select(sortBy)' to the query.
   *
   * 4. Create a default sort in the else clause.
   *   Will return all documents in a descending order by the createdAt field.
   * 
   * 5. Return 'this' outside if statement so we can chain the sort() method to the query when the query is being executed..
   */
  sort() {
    if(this.query.sort) {
      const sortBy = this.query.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  // FIELD LIMITING
  ////////////////////////////////
  /**
   * FIELD LIMITING
   * --------------
   * The client chooses which fields they can get back in response.
   *   Ex. 127.0.0.1:3000/api/v1/tours?fields=title,description,difficulty,completed
   *     Only receiving the fileds specified by 'field' variable.
   *   Ex. 127.0.0.1:3000/api/v1/tours?fields=-__v
   *     The - means we want to exclude the field, not include it.
   *
   * Its best practices to limit the amount of data returned so we limit the use of bandwidth.
   *
   * We can also limit what fields are returned from the query in the Schema with the 'select' property.
   *
   * 1. Check if 'field' is in this.queryString.
   *
   * 2. Then create new variable (fields) set to separate the fields by comma and join with a space.
   *   Ex. this.queryString.fields.split(',').join(' ');
   *
   * 3. Then chain 'select(fields)' to the query.
   *
   * 4. Create a default field limit in the else clause.
   *   Want to return all the fields EXCEPT the '__v' field.
   * 
   * 5. return 'this' so we can chain the limitFields() method to the query when the query is being executed.
   */
  limitFields() {
    if(this.queryString.fields) {
      let fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  // PAGINATION
  /////////////////////////////////
  /**
   * PAGINATION
   * ----------
   * Figures out the number of pages to return results and how many results on each page.
   *   Ex. 127.0.0.1:3000/api/v1/tours?page=2&limit=10
   *
   * ?page=2&limit=10
   * query = query.skip(10).limit(10);
   * Use the skip() and limit() methods when the user chooses a certain page.
   *   If the limit of results for each page is 10, and the user wants to be on page 2,
   *   then we need to skip the first 10 results so we start with results 11-20.
   *   If the user wants page 5, then we need to skip the first 40 results and return 41-50.
   *
   * If the user requests a page that doesnt exist bc theres not enough results to have the requested page,
   *   First make sure this.queryString.page exists,
   *   Then await for Model.countDocuments() method to return total amount of documents for the model.
   *   If the number of documents skipped is greater than or equal to total documents, then the page doesnt exist and throw an error.
   *
   * 1. Define 'page' variable and set to value by multiplying this.queryString.page by 1 to convert the string to number.
   *   Use || to define default value if there is no page field in this.queryString.
   *
   * 2. Define 'limit' variable and set to value by multiplying this.queryString.limit by 1 to convert the string to number.
   *    Use || to define default value if there is no limit field in this.queryString.
   *
   * 3. Define 'skip' variable and set to value by muliplying the previous page number by the limit.
   *    const skip = (page - 1) * limit;
   *
   * 4. Chain skip(skip_var) and limit(limit_var) methods to the query.
   *    this.query = this.query.skip(skip).limit(limit);
   *
   * 5. return 'this' so we can chain the paginate() method to the query when the query is being executed. 
   */
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page -1) * limit;

    this.query = this.query.skip(skip).limit(limit);
  }
}

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
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // EXECUTE THE QUERY
    /////////////////////////////////
    const tours = await features.query;

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