const mongoose = require('mongoose')

const ticketColl = 'tickets'
const ticketSchema = new mongoose.Schema(
    {
        code: {
            type: String, 
            unique: true, 
            required: true
        },
        purchase_datetime: {
            type: Date,
            default: Date.now
        },
        amount: {
            type: Number, 
            required: true
        },
        purchaser: {
            type: String, 
            required: true
        }
    },{timestamps: true}
)

ticketSchema.pre('save', async (next) => {
    const ticket = this
    if(!ticket.code){
        ticket.code = `TICKET-${Date.now()}`
    }
    next()
})

const ticketModel = mongoose.model(ticketColl, ticketSchema)
module.exports = ticketModel