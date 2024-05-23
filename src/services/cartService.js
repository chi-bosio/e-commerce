const {CartDAO} = require('../dao/managers/factory')
const CartDTO = require('../dto/cartDTO')

class CartService{
    constructor(){
        this.cartDAO = new CartDAO()
    }

    async addProductToCart(cid, pid){
        return await this.cartDAO.addProductToCart(cid, pid)
    }

    async getAllCarts(){
        return await this.cartDAO.getAllCarts()
    }

    async getCartById(cid){
        const cart = await this.cartDAO.getCartById(cid)
        if(!cart){
            throw new Error('No se encontró ningún carrito')
        }
        await cart.populate('products.pid')
        return new CartDTO(cart)
    }

    async createCart(initialProducts = []){
        return await this.cartDAO.createCart(initialProducts)
    }

    async removeProductFromCart(cid, pid){
        return await this.cartDAO.removeProductFromCart(cid, pid)
    }

    async updateProductQuantity(cid, pid, quantity){
        return await this.cartDAO.updateProductQuantity(cid, pid, quantity)
    }

    async removeAllProductsFromCart(cid){
        return await this.cartDAO.removeAllProductsFromCart(cid)
    }
}

module.exports = new CartService()