const CartService = require('../services/cartService')
const ProductService = require('../services/productService')
const TicketService = require('../services/ticketService')
const CustomError = require('../errors/customError')
const errorList = require('../utils/errorList')

class CartController{
    static async getAllCarts(req, res){
        try {
            const carts = await CartService.getAllCarts()
            res.status(200).json(carts)
        } catch (error) {
            res.status(500).json({error: `Error al obtener los carritos: ${error.message}`})
        }
    }

    static async createCart(req, res){
        const initialProducts = req.body.products || []

        try {
            const newCarts = await CartService.createCart(initialProducts)
            res.status(200).json(newCarts)
        } catch (error) {
            res.status(500).json({error: `Error al crear el carrito: ${error.message}`})
        }
    }

    static async getCartById(req, res, next){
        const {cid} = req.params

        try {
            const cartDTO = await CartService.getCartById(cid)
            if(!cartDTO){
                throw new CustomError(
                    errorList.CART_NOT_FOUND.status, 
                    errorList.CART_NOT_FOUND.code, 
                    errorList.CART_NOT_FOUND.message
                )
            }
            res.status(200).json(cartDTO)
        } catch (error) {
            next(error)
        }
    }

    static async addProductToCart(req, res){
        const {cid, pid} = req.params

        try {
            const addedProduct = await CartService.addProductToCart(cid, pid)
            res.status(200).json(addedProduct)
        } catch (error) {
            res.status(500).json({error: `Error al agregar el producto: ${error.message}`})
        }
    }

    static async removeProductFromCart(req, res){
        const {cid, pid} = req.params

        try {
            await CartService.removeProductFromCart(cid, pid)
            res.status(200).json({message: 'El producto ha sido eliminado del carrito con éxito'})
        } catch (error) {
            res.status(500).json({error: `Error al eliminar el producto del carrito: ${error.message}`})
        }
    }

    static async updateProductQuantity(req, res){
        const {cid, pid} = req.params
        const {quantity} = req.body

        try {
            const updatedProduct = await CartService.updateProductQuantity(cid, pid, quantity)
            res.status(200).json(updatedProduct)
        } catch (error) {
            res.status(500).json({error: `Error al actualizar la cantidad del producto: ${error.message}`})
        }
    }

    static async removeAllProductsFromCart(req, res){
        const {cid} = req.params

        try {
            await CartService.removeAllProductsFromCart(cid)
            res.status(200).json({message: 'El carrito ha sido eliminado con éxito'})
        } catch (error) {
            res.status(500).json({error: `Error al eliminar el carrito: ${error.message}`})
        }
    }

    static async purchaseCart(req, res){
        const {cid} = req.params
        const userEmail = req.session.user.email

        try {
            const cart = await CartService.getCartById(cid)
            if(!cart){
                return res.status(404).json({error: 'Carrito no encontrado'})
            }

            let totalAmount = 0
            const purchaseProducts = []

            for(const item of cart.products){
                const product = await ProductService.getProductById(item.pid)

                if(product.stock >= item.quantity){
                    product.stock -= item.quantity;
                    await ProductService.updateProduct(product._id, {stock: product.stock});
                    totalAmount += product.price * item.quantity;

                    purchaseProducts.push({
                        pid: product._id,
                        quantity: item.quantity,
                        price: product.price
                    });
                } else{
                    res.status(400).json({error: `No hay suficiente stock para el producto ${product.name}`})
                }
            }

            const newTicket = await TicketService.createTicket({
                amount: totalAmount,
                purchaser: userEmail
            })

            await CartService.removeAllProductsFromCart(cid)
            res.status(200).json({message: 'Compra realizada con éxito', ticket: newTicket})
        } catch (error) {
            res.status(500).json({error: `Error al realizar la compra: ${error.message}`})
        }
    }
}

module.exports = CartController