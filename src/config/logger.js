const {createLogger, transports, format, addColors} = require('winston')
const config = require('./config')
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

addColors(logLevels.colors)

const devLogger = createLogger(
    {
        levels: logLevels.levels,
        transports: [
            new transports.Console({
                level: 'debug',
                format: format.combine(
                    format.colorize({colors: logLevels.colors}),
                    format.simple()
                )
            })
        ]
    }
)

const prodLogger = createLogger(
    {
        levels: logLevels.levels,
        transports: [
            new transports.Console({
                level: 'info',
                format: format.combine(
                    format.colorize({colors: logLevels.colors}),
                    format.simple()
                )
            }),
            new transports.File({
                filename: path.join(__dirname, '../logs/errors.log'),
                level: 'fatal',
                format: format.combine(
                    format.timestamp(),
                    format.prettyPrint()
                )
            })
        ]
    }
)

module.exports = config.mode === 'prod' ? prodLogger : devLogger