const errorList = require('./errorList')

class CustomError extends Error{
    constructor(errorCode, additionalInfo){
        super(getErrorMessage(errorCode) || 'Error desconocido')
        this.errorCode = errorCode
        this.additionalInfo = additionalInfo
    }
}

function getErrorMessage(errorCode){
    switch(errorCode){
        case errorList.PRODUCT_NOT_FOUND:
            return {
                status: 404,
                message: 'Producto no encontrado'
            }
        case errorList.CART_NOT_FOUND:
            return {
                status: 404,
                message: 'Carrito no encontrado'
            }
        case errorList.USER_NOT_FOUND:
            return {
                status: 404,
                message: 'Usuario no encontrado'
            }
        case errorList.INSUFFICIENT_STOCK:
            return {
                status: 400,
                message: 'Stock insuficiente'
            }
        case errorList.INVALID_INPUT:
            return {
                status: 400,
                message: 'Datos inválidos'
            }
        default:
            return 'Error desconocido'
    }
}

module.exports = CustomError