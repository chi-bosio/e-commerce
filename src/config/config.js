const dotenv = require('dotenv')

dotenv.config({
    path: '../../.env',
    override: true
})

const config = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
    CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
    PERSISTENCE: process.env.PERSISTENCE || 'mongo'
}

module.exports = config