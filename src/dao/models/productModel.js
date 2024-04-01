const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const productSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        price: Number,
        thumbnail: String,
        code: String,
        stock: Number,
        status: Boolean
    },{
        collection: 'products'
    }
)

productSchema.plugin(paginate)

const productModel = mongoose.model('products', productSchema)
module.exports = productModel