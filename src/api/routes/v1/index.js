const express = require('express');

// const userRoutes = require('./users.route');
const authRoutes = require('./auth');
const apiRoutes = require('./api');



const Response = require('../../../helpers/response.helper');
const { requireJwtAuth } = require('../../../middlewares/auth');

const router = express.Router();



/**
 * Get v1/status
 */

// router.get('/status', (req, res) => res.send('OK'));
router.get('/status', requireJwtAuth, (req, res) => Response.Ok(res, 'Ok'));


// Define your routes here
router.use('/auth', authRoutes);

router.use('/api/v1', apiRoutes);


module.exports = router;