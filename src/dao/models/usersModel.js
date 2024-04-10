const mongoose = require('mongoose')

const userColl = 'users'
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email:{
        type: String, unique:true
    }, 
    age: Number,
    password: String,
    range: {
        type: String,
        default: 'user'
    }
},{
    timestamps: true
})

const userModel = mongoose.model(userColl, userSchema)
module.exports = userModel