const mongoose = require('mongoose')
const config = require('./config')
const {devLogger} = require('../utils/logger')

const URI = config.MONGO_URL
const connToDB = () => {
    try {
        mongoose.connect(URI)
        devLogger.info('Conectando a la DB ecommerce')
    } catch (error) {
        devLogger.error(error)
    }
}

module.exports = connToDB