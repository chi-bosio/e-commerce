const {ProductDAO} = require('../dao/managers/factory')

class ProductService{
    constructor(){
        this.productDAO = new ProductDAO()
    }

    async getProducts(limit = 4){
        return await this.productDAO.getProducts(limit)
    }

    async addProduct(productData){
        return await this.productDAO.addProduct(productData)
    }

    async getProductById(id){
        return await this.productDAO.getProductById(id)
    }

    async updateProduct(id, updatedFields){
        return await this.productDAO.updateProduct(id, updatedFields)
    }

    async deleteProducts(id){
        return await this.productDAO.deleteProducts(id)
    }
}

module.exports = new ProductService()