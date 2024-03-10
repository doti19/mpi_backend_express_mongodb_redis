const httpStatus = require('http-status');
const mongoose = require('mongoose');
const expressValidation = require('express-validation');
const {APIError} = require('../errors/apiError');
const {server} = require('../config/config');
const logger = require('../config/logger');

/**
 * Error handler. Send stacktrace only during development
 * @public
 */

const handler = (err, req, res, next) => {
    const response = {
        code: err.status,
        message: err.message || httpStatus[err.status],
        errors: err.errors,
        stack: err.stack,
    };
    // if(server.env === 'production'){
        logger.error(err);
    // }
    if (server.env === 'production' ) {
        delete response.stack;
        // delete response.message;
    }

    
    res.status(err.status);
    res.json(response);
}

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
const converter = (err, req, res, next)=>{
    let convertedError = err;
    if(err instanceof expressValidation.ValidationError){
        convertedError = new APIError({
            message: 'Validation Error',
            errors: err.errors,
            status: err.status,
            stack: err.stack,
        });
    } else if(!(err instanceof APIError)){
        const statusCode = err.statusCode || err instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = err.message || httpStatus[statusCode];
        convertedError = new APIError({
            message: message,
            status: statusCode,
            isPublic: true,
            stack: err.stack,
        });
    }
    return handler(convertedError, req, res);   
}





/**
 * Catch 404 and forward to error handler
 * @public
 */

const notFound = (req, res, next) => {
    const err = new APIError({
        message: `🔍 - Not Found - ${req.originalUrl}`,
        status: httpStatus.NOT_FOUND,
    });
   
    return handler(err, req, res);
}


// /* eslint-disable no-unused-vars */
// function errorHandler(err, req, res, next) {
//    /* eslint-enable no-unused-vars */
//    const statusCode = res.statusCode !== 200 ? res.statusCode : 500
//    res.status(statusCode)
//    res.json({
//       message: err.message,
//       stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
//    })
// }
module.exports = {
   notFound,
   converter,
   handler,
}
