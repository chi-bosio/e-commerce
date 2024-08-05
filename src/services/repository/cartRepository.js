const CartDao = require('../../dao/cartDao')

class CartRepository{
    constructor(){
        this.cartDAO = new CartDao()
    }

    async addProductToCart(cid, pid, quantity = 1){
        return await this.cartDAO.addProductToCart(cid, pid, quantity)
    }

    async getAllCarts(){
        return await this.cartDAO.getAllCarts()
    }

    async getCartById(cid){
        return await this.cartDAO.getCartById(cid)
    }

    async createCart(){
        return await this.cartDAO.createCart()
    }

    async removeProductFromCart(cid, pid){
        return await this.cartDAO.removeProductFromCart(cid, pid)
    }

    async updateCart(cid, updatedProducts){
        return await this.cartDAO.updateCart(cid, updatedProducts)
    }

    async updateProductQuantity(cid, pid, newQuantity){
        return await this.cartDAO.updateProductQuantity(cid, pid, newQuantity)
    }

    async removeAllProductsFromCart(cid){
        return await this.cartDAO.removeAllProductsFromCart(cid)
    }

    async emptyCart(cid){
        return await this.cartDAO.emptyCart(cid)
    }
}

module.exports = CartRepository