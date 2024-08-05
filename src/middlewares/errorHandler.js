const customError = require('../services/errors/customError')
const logger = require('../config/logger')

function errorHandler(error, req, res, next){
    req.logger.error('Error detectado entrando al ErrorHandler:')
    req.logger.error(`Name: ${error.name}`)
    req.logger.error(`Code: ${error.code}`)
    req.logger.error(`Message: ${error.message}`)

    if(error.additionalInfo){
        req.logger.error(`Additional Info: ${error.additionalInfo}`)
    }

    switch(error.errorCode){
        case errorList.PRODUCT_NOT_FOUND:
            res.status(404).json({status: 'error', error: error.message})
            break
        case errorList.CART_NOT_FOUND:
            res.status(404).json({status: 'error', error: error.message})
            break
        case errorList.USER_NOT_FOUND:
            res.status(404).json({status: 'error', error: error.message})
            break
        case errorList.INSUFFICIENT_STOCK:
            res.status(400).json({status: 'error', error: error.message})
            break
        case errorList.INVALID_INPUT:
            res.status(400).json({status: 'error', error: error.message})
            break
        default:
            res.status(500).json({ status: 'error', error: 'Error desconocido!' });
    }
}

module.exports = errorHandler