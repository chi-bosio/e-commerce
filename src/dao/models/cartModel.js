const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const cartSchema = new Schema(
    {
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            }
        ]
    },{
        timestamps: true
    }
)

productSchema.plugin(paginate)

const productModel = mongoose.model('carts', cartSchema)
module.exports = productModel