const nodemailer = require('nodemailer')
const config = require('./config')
const {devLogger} = require('./logger')

const transp = nodemailer.createTransport({
    service: 'gmail',
    port: '587',
    auth: {
        user: config.USER_GMAIL,
        pass: config.PASS_GMAIL
    }
})

const sendEmail = async(to, subject, message) => {
    const options = {
        from: `Backend DC ${config.USER_GMAIL}`,
        to, subject,
        html: message
    }

    try {
        const info = await transp.sendMail(options)
        devLogger.info(`Message sent: ${info}`)
    } catch (error) {
        devLogger.error(`Error al enviar el email: ${error}`)
        throw error
    }
}

module.exports = sendEmail