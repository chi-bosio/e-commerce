const mongoose = require('mongoose')

const cartColl = 'carts'
const cartSchema = new mongoose.Schema(
    {
        products: {
            type: [
                {
                    pid: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'products'
                    },
                    quantity: Number
                }
            ]
        }
    },{
        timestamps: true
    }
)

const cartModel = mongoose.model(cartColl, cartSchema)
module.exports = cartModel