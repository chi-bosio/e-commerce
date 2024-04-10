const mongoose = require('mongoose')

const userColl = 'users'
const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, required: true}
},{
    timestamps: true
})

const userModel = mongoose.model(userColl, userSchema)
module.exports = userModel