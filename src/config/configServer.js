const mongoose = require('mongoose')
const config = require('./config')
const logger = require('../config/logger')

const URI = config.MONGO_URL
const connToDB = () => {
    try {
        mongoose.connect(URI)
        logger.info('Conectando a la DB ecommerce')
    } catch (error) {
        logger.error(error)
    }
}

module.exports = connToDB