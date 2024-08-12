const mongoose = require('mongoose')

const userColl = 'users'
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            lowercase: true,
            required: [true, 'No puede quedar vacío']
        },
        email: {
            type: String, 
            lowercase: true,
            required: [true, 'No puede quedar vacío'],
            match: [/\S+@\S+\.\S+/, "Inválido"],
            index: true,
            unique: true
        },
        password: {type: String},
        age: {type: Number},
        role: {
            type: String,
            enum: ['user', 'premium', 'admin'],
            default: 'user'
        },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'carts'
        },
        documents: [
            {
                name: String,
                reference: String
            }
        ],
        last_connection: Date
    },{
        timestamps: true, strict: false
    }
)

const userModel = mongoose.model(userColl, userSchema)
module.exports = userModel