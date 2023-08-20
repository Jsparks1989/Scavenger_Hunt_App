/**
 * USERROUTES.JS
 * ================================================================
 * 
 *
 * Required
 * --------
 * all of userControllers
 *  - from controllers/userController.js
 * 
 * 
 * Exports
 * -------
 * router
 *  - imported by app.js
 * 
 */

/* ===========================================================================
    REQUIREMENTS / VARIABLES
=========================================================================== */
const express = require('express');
const userController = require('../controllers/userController');



/* ===========================================================================
    ROUTER & ROUTES
=========================================================================== */
const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);




/* ===========================================================================
    EXPORTS
=========================================================================== */
module.exports = router;