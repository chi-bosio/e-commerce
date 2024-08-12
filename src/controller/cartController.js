const CartRepository = require('../services/repository/cartRepository')
const cartRepository = new CartRepository()
const ProductRepository = require('../services/repository/productRepository')
const productRepository = new ProductRepository()
const cartModel = require('../dao/models/cartModel')
const CustomError = require('../services/errors/customError')
const errorList = require('../services/errors/errorList')
const mongoose = require('mongoose')

class CartController{
    static async getCarts(req, res){
        try {
            res.json({carts: await cartRepository.getCarts()})
        } catch (error) {
            res.status(500).json({error: `Error al obtener los carritos: ${error.message}`})
        }
    }

    static async createCart(req, res){
        try {
            const newCarts = await cartRepository.createCart()
            res.json(newCarts)
        } catch (error) {
            req.logger.error(`Error al crear el carrito: ${error.message}`)
            res.status(500).json({error: 'Error interno'})
        }
    }

    static async getCartById(req, res, next){
        const { cid } = req.params;

        try {
            const cartId = mongoose.Types.ObjectId.isValid(cid) ? new mongoose.Types.ObjectId(cid) : cid
            
            const cart = await cartModel.findOne({ _id: cartId }).populate('products.pid')
    
            if (!cart) {
                throw new CustomError(
                    errorList.CART_NOT_FOUND, {cid}
                )
            }

            const productsInCart = cart.products.map(i => {
                return {
                    product: i.pid ? i.pid.toObject() : null,
                    quantity: i.quantity
                };
            })
    
            res.json({ cart, products: productsInCart })
        } catch (error) {
            next(error);
        }
    }

    static async addProductToCart(req, res, next) {
    const { cid, pid } = req.params;
    const quantity = req.body.quantity || 1;

    try {
        const updatedCart = await cartRepository.addProductToCart(cid, pid, quantity)

        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' })
        }

        const totalQuantity = updatedCart.products.reduce((acc, p) => acc + p.quantity, 0)

        res.json({ products: updatedCart.products, totalQuantity })
    } catch (error) {
        next(error)
    }
}

    static async removeProductFromCart(req, res){
        const {cid, pid} = req.params

        try {
            const updatedCart = await cartRepository.removeProductFromCart(cid, pid)
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
            let updatedCart = await cartRepository.updateCart(cid, updatedProduct)
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
            const updatedCart = await cartRepository.updateProductQuantity(cid, pid, quantity)
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
            const updatedCart = await cartRepository.emptyCart(cid)
            
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