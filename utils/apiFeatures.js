/**
 * This class helps build queries for the database.
 *
 * Is used in controllers.
 * --------------------------------------------------------------------------
 * IMPORT:
 *   N/A
 *
 * EXPORT:
 *   APIFeatures class
 */

/* ===========================================================================
    REQUIRE 
=========================================================================== */

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

    return this;
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
    if(this.queryString.sort) {
      const sortBy = this.query.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // this.query = this.query.sort('-createdAt');
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

    return this;
  }
}

/* ===========================================================================
    EXPORTS 
=========================================================================== */
module.exports = APIFeatures;