const winston = require('winston')
const config = require('../config/config')
const path = require('path')

const logLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
}

winston.addColors(logLevels.colors)

const devLogger = winston.createLogger(
    {
        levels: logLevels.levels,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({colors: logLevels.colors}),
                    winston.format.simple()
                ),
            }),
            new winston.transports.File({
                filename: path.join(__dirname, '../logs/errors.log'),
                level: 'error',
                format: format.combine(
                    format.uncolorize(),
                    format.timestamp(),
                    format.json()
                )
            })
        ]
    }
)

const prodLogger = winston.createLogger(
    {
        levels: logLevels.levels,
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize({colors: logLevels.colors}),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: path.join(__dirname, '../logs/errors.log'),
                level: 'error',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.prettyPrint()
                )
            })
        ]
    }
)

const logger = (req, res, next) => {
    if(config.mode === 'prod'){
        req.logger = prodLogger
    } else{
        req.logger = devLogger
    }
    next()
}

module.exports = logger