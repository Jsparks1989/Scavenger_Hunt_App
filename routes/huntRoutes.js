/**
 * SCAVHUNTROUTES.JS
 * ================================================================
 * 
 *
 * Required
 * --------
 * all of scavhuntControllers
 *  - from controllers/scavhuntController.js
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
const huntController = require('../controllers/huntController');



/* ===========================================================================
    ROUTER & ROUTES
=========================================================================== */
const router = express.Router();

router
  .route('/')
  .get(huntController.getAllHunts)
  .post(huntController.createHunt);


router
  .route('/:id')
  .get(huntController.getHunt)
  .patch(huntController.updateHunt)
  .delete(huntController.deleteHunt);




/* ===========================================================================
    EXPORTS
=========================================================================== */
module.exports = router;