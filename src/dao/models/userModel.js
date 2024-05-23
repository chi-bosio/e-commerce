const mongoose = require('mongoose')

const userColl = 'users'
const userSchema = new mongoose.Schema(
    {
        username: {type: String},
        email: {type: String, unique: true},
        password: {type: String},
        role: {type: String}
    },{
        timestamps: true, strict: false
    }
)

const userModel = mongoose.model(userColl, userSchema)
module.exports = userModel