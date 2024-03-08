const logger = require('./config/logger');
const config = require('./config/config');
const app =require('./config/express');
const mongoose = require('./config/mongoose');
const client = require('./config/redis');
const port = config.server.port ;

mongoose.connect();
client.connect();

app.listen(port, () => {
    logger.info(`Server is running on port ${port} and ${config.server.env} mode.`);
});

process.on('SIGINT', () => {
    client.quit();
    mongoose.disconnect();
    process.exit();
});
