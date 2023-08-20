/**
 * USERCONTROLLER.JS
 * ================================================================
 * - Application Logic (Code that is only concerned about the application's implementation, not the underlying business problem we're trying to solve (ex. showing and selling tours).)
 * - Lean Controllers- Keep the controllers as simple and lean as possible.
 *
 * Required
 * --------
 * The User model (Will do this later)
 * 
 * 
 * Exports
 * -------
 * Each Controller will be exported.
 *  - imported by routes/userRoutes.js
 * 
 */



exports.getAllUsers = (req, res) => {
  
  try {


    // SEND RESPONSE
    ///////////////////////
    res.status(200).json({
      status: 'success',
      data: '** Get All Users **'
    }); 
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err
    }); 
  }
  
}


exports.getUser = (req, res) => {
  
  try {


    // SEND RESPONSE
    ///////////////////////
    res.status(200).json({
      status: 'success',
      data: `getting user id ${req.params.id}`
    }); 
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err
    }); 
  }
  
}


exports.createUser = (req, res) => {
  
  try {


    // SEND RESPONSE
    ///////////////////////
    res.status(200).json({
      status: 'success',
      data: req.body
    }); 
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err
    }); 
  }
  
}


exports.updateUser = (req, res) => {
  
  try {


    // SEND RESPONSE
    ///////////////////////
    res.status(200).json({
      status: 'success',
      data: `updating user id ${req.params.id}`
    }); 
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err
    }); 
  }
  
}


exports.deleteUser = (req, res) => {
  
  try {


    // SEND RESPONSE
    ///////////////////////
    res.status(200).json({
      status: 'success',
      data: '** Delete User **'
    }); 
  } catch (err) {
    res.status(400).json({
      status: 'error',
      data: err
    }); 
  }
  
}

