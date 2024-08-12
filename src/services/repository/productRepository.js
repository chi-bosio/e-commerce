const ProductDAO = require('../../dao/productDao')

class ProductRepository{
    constructor(){
        this.productDAO = new ProductDAO()
    }

    async getProducts(limit = 10){
        return await this.productDAO.getProducts(limit)
    }

    async addProduct(productData){
        const {title, description, price, thumbnail, code, stock, category, status, owner} = productData
        return await this.productDAO.addProduct(title, description, price, thumbnail, code, stock, category, status, owner)
    }

    async getProductById(pid){
        return await this.productDAO.getProductById(pid)
    }

    async updateProduct(pid, updatedFields){
        return await this.productDAO.updateProduct(pid, updatedFields)
    }

    async deleteProduct(pid){
        return await this.productDAO.deleteProduct(pid)
    }

    async getProductFiltered(category = null){
        return await this.productDAO.getProductFiltered(category)
    }
}

module.exports = ProductRepository