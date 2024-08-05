const ProductDAO = require('../../dao/productDao')

class ProductRepository{
    constructor(){
        this.productDAO = new ProductDAO()
    }

    async getProducts(limit = 10){
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

    async getProductFiltered(category = null){
        return await this.productDAO.getProductFiltered(category)
    }
}

module.exports = ProductRepository