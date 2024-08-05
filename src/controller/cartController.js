const CartRepository = require('../services/repository/cartRepository')
const ProductRepository = require('../services/repository/productRepository')
const cartModel = require('../dao/models/cartModel')
const CustomError = require('../services/errors/customError')
const errorList = require('../services/errors/errorList')

class CartController{
    static async getCarts(req, res){
        try {
            res.json({carts: await CartRepository.getCarts()})
        } catch (error) {
            res.status(500).json({error: `Error al obtener los carritos: ${error.message}`})
        }
    }

    static async createCart(req, res){
        try {
            const newCarts = await CartRepository.createCart()
            res.json(newCarts)
        } catch (error) {
            req.logger.error(`Error al crear el carrito: ${error.message}`)
            res.status(500).json({error: 'Error interno'})
        }
    }

    static async getCartById(req, res, next){
        const {cid} = req.params

        try {
            const cart = await cartModel.findOne(cid)
            if(!cart){
                throw new CustomError(
                    errorList.CART_NOT_FOUND, {cid}
                )
            }

            const productsInCart = cart.products.map(i => ({
                product: i.product.toObject(),
                quantity: i.quantity
            }))

            res.json(cart)
        } catch (error) {
            next(error)
        }
    }

    static async addProductToCart(req, res, next){
        const {cid, pid} = req.params

        try {
            const addedProduct = await ProductRepository.getProductById(pid)
            let quantity = req.body.quantity || 1

            if(!addedProduct){
                throw new CustomError(
                    errorList.PRODUCT_NOT_FOUND, {pid}
                )
            }

            const updateCart = await CartRepository.addProductToCart(cid, pid, quantity)
            const totalQuantity = updateCart.products.reduce((acc, i) => acc + i.quantity, 0)

            res.json({products: updateCart.products, totalQuantity})
        } catch (error) {
            next(error)
        }
    }

    static async removeProductFromCart(req, res){
        const {cid, pid} = req.params

        try {
            const updatedCart = await CartRepository.removeProductFromCart(cid, pid)
            res.json({
                status: 'success',
                message: 'El producto ha sido eliminado del carrito con éxito',
                updateCart
            })
        } catch (error) {
            req.logger.error(`Error al eliminar el producto del carrito: ${error.message}`)
            res.status(500).json({status: 'error', error: 'Error interno'})
        }
    }

    static async updateCart(req, res){
        const {cid} = req.params
        const updatedProduct = req.body
        
        try {
            let updatedCart = await CartRepository.updateCart(cid, updatedProduct)
            res.json(updatedCart)
        } catch (error) {
            req.logger.error(`Error al actualizar el carrito: ${error.message}`)
            res.status(500).json({
                status: 'error',
                error: 'Error interno'
            })
        }
    }

    static async updateProductQuantity(req, res){
        const {cid, pid} = req.params
        const {quantity} = req.body

        try {
            const updatedCart = await CartRepository.updateProductQuantity(cid, pid, quantity)
            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada con éxito',
                updatedCart
            })
        } catch (error) {
            req.logger.error(`Error al actualizar la cantidad de productos en el carrito: ${error.message}`)
            res.status(500).json({
                status: 'error',
                error: 'Error interno'
            })
        }
    }

    static async emptyCart(req, res){
        const {cid} = req.params

        try {
            const updatedCart = await CartRepository.emptyCart(cid)
            
            res.json({
                status: 'success',
                message: 'Productos eliminado del carrito con éxito'
            })
        } catch (error) {
            req.logger.error(`Error al vaciar el carrito: ${error.message}`)
            res.status(500).json({
                status: 'error',
                error: 'Error interno'
            })
        }
    }
}

module.exports = CartController