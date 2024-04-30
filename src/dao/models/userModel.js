const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const userColl = 'users'
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email:{
        type: String, unique:true
    }, 
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cartModel'
    },
    role: {
        type: String, default: 'user'
    }
},{
    timestamps: true
})

userSchema.plugin(uniqueValidator, {message: 'Ya elegido'})

const userModel = mongoose.model(userColl, userSchema)
module.exports = userModel