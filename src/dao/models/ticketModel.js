const mongoose = require('mongoose')
const {v4: uuidv4} = require('uuid')

const ticketColl = 'tickets'
const ticketSchema = new mongoose.Schema(
    {
        code: {type: String, unique: true, default: uuidv4, required: true},
        amount: {type: Number, required: true},
        purchaser: {type: String, required: true}
    },{
        timestamps: {createdAt: 'purchase_datetime', updatedAt: false}
    }
)

const ticketModel = mongoose.model(ticketColl, ticketSchema)
module.exports = ticketModel