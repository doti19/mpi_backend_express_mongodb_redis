// const mongoose = require('mongoose');
// const config = require('./config');

// mongoose.connect(config.mongoose)
//     .then(() => {
//         console.log('Connected to MongoDB');
//     })
//     .catch((error) => {
//         console.error('Error connecting to MongoDB:', error);
//     });
const mongoose = require('mongoose');
const logger = require('./logger');
const {mongo, server} = require('./config');

mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
});

// print mongoose logs in dev env
if(server.env === 'development') {
    mongoose.set('debug', true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
    mongoose.connect(mongo.uri, mongo.options)
    .then(() => {
        logger.info('Connected to MongoDB');
    });
    return mongoose.connection;
}

/**
 * Disconnect from mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.disconnect = () => {
    mongoose.disconnect();
    return mongoose.connection;
}
    