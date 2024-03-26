const mongoose = require("mongoose")

const messageColl = "messages"
const messageSchema = new mongoose.Schema (
    {
        user: {
            type: String,
            required: true
        }, 
        message: {
            type: String,
            required: true
        }
    }
)

const messageModel = mongoose.model(messageColl, messageSchema)

module.exports = messageModel