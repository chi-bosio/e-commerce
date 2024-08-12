const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const productColl = 'products'
const productSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        description: String,
        price: {type: Number, required: true},
        thumbnail: String,
        code: {type: String, required: true, unique: true},
        stock: {type: Number, required: true},
        status: Boolean,
        category: String,
        quantity: {type: Number, default: 1},
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: [false],
            default: null
        }
    },{
        timestamps: true
    }
)

productSchema.plugin(paginate)

const productModel = mongoose.model(productColl, productSchema)
module.exports = productModel