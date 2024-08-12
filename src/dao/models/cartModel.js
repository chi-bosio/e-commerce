const mongoose = require('mongoose')

const cartColl = 'carts'
const cartSchema = new mongoose.Schema({
    products: [
        {
            pid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
}, {
    timestamps: true
});

const cartModel = mongoose.model(cartColl, cartSchema)
module.exports = cartModel