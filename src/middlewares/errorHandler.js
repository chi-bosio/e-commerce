const CustomError = require('../errors/customError')

function errorHandler(err, req, res, next){
    if(err instanceof CustomError){
        const errorResponse = {
            code: err.code,
            message: err.message
        }
        return res.status(err.status).json(errorResponse)
    }

    const errorResponse = {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error ocurred'
    }
    return res.status(500).json(errorResponse)
}

module.exports = errorHandler