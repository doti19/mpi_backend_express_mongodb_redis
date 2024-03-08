const {createClient} = require('redis');
const {redis} = require('./config');
const logger = require('./logger');

class Redis extends createClient {
    constructor(options) {
        if(typeof Redis.instance === 'object') {
            return Redis.instance;
        }
        super({options});
        Redis.instance = this;
        
    }
}

const client = new Redis({...redis.url});

client.on('connect', () => {
    logger.info('Connected to Redis');
});

client.on('error', (error) => {
    logger.error(`Error connecting to Redis: ${error}`);
    client.disconnect();
    // client.stop()
//    await client.quit();
});

client.on('end', () => {
    logger.info('Disconnected from Redis');
});

module.exports =client;