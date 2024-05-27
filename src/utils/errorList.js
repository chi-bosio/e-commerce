const errorList = {
    PRODUCT_NOT_FOUND: {
        status: 404,
        message: 'Producto no encontrado'
    },
    CART_NOT_FOUND: {
        status: 404,
        message: 'Carrito no encontrado'
    },
    USER_NOT_FOUND: {
        status: 404,
        message: 'Usuario no encontrado'
    }, 
    INSUFFICIENT_STOCK: {
        status: 400,
        message: 'Stock insuficiente'
    },
    INVALID_INPUT: {
        status: 400,
        message: 'Datos inválidos'
    }
}

module.exports = errorList