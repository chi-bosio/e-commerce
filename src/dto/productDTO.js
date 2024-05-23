class ProductDTO{
    constructor({tittle, description, price, thumbnail, code, stock, status, category}){
        this.tittle = tittle
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.status = status
        this.category = category
    }
}

module.exports = ProductDTO