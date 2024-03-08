// if you want to use pino
const winston = require('winston');
const config = require('./config');
const { combine, timestamp, printf, colorize, align, json, errors, prettyPrint, cli, splat} = winston.format;
require('winston-daily-rotate-file');
//syslog levels are the following:
// emerge: 0,
// alert: 1,
// crit: 2,
// error: 3,
// warning: 4,
// notice: 5,
// info: 6,
// debug: 7
// 0-3 are considered critical
// 4-5 are considered warnings
// 6-7 are considered informational

const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    level: 'info',
    maxSize: '20m',
    maxFiles: '14d',

});

const fileRotateTransportError = new winston.transports.DailyRotateFile({
    filename: 'logs/applicationError-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',
    format: combine(
        errors({stack: true, message: true, meta: true, name: true, code: true, level: true, path: true, status: true, method: true, query: true, body: true, headers: true, }),
        json(),

    ),
});
const logger = winston.createLogger({
    // exitOnError: false,
    levels: winston.config.syslog.levels,
    // level: config.logLevel || 'info',
    // defaultMeta: {
    //     theGuyUsing: 'admin'
    // },
    format: config.server.env !=='production' ? combine(
        colorize({all: true}),
        errors({stack: true }),
        json(),
            // splat(),
            // align(),
            // prettyPrint(),

            cli(
                {
                    colors: {
                        info: 'green',
                        error: 'red',
                        warning: 'yellow',
                        debug: 'blue',
                    },

                }
            ),
            printf(info => `-> ${info.level}: ${info.message} ${info.stack? `\n${info.stack}`: ''}`),


    ) : combine(timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS A'
    }), 
    errors({stack: false}),
    json()),
    //exceptionHanglers and rejectionHandlers are useless
    // exceptionHandlers: [
    //     config.server.env !=='production' ?new winston.transports.Console(): [new winston.transports.Console(), new winston.transports.File({ filename: 'logs/exceptions.log' })],
    // ],
    // rejectionHandlers: [
    //     config.server.env !=='production' ? new winston.transports.Console(): [new winston.transports.Console(),new winston.transports.File({ filename: 'logs/rejections.log' })],
    // ],
    //TODO uncomment this one, and delete the one below on production
    // transports: config.server.env !=='production' ? [new winston.transports.Console()]: [ fileRotateTransport, fileRotateTransportError],
    transports: config.server.env ==='production' ? new winston.transports.Console(): [new winston.transports.Console(), fileRotateTransport, fileRotateTransportError],
});

logger.stream = {
    write: message => logger.info(message.trim()),
};

module.exports = logger;