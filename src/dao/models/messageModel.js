const mongoose = require('mongoose')

const messageColl = 'message'
const messageSchema = new mongoose.Schema(
    {
        user: String,
        message: String
    },{
        timestamps: true
    }
)

const messageModel = mongoose.model(messageColl, messageSchema)
module.exports = messageModel