const dotenv = require('dotenv')
const {Command, Option} = require('commander')

let command = new Command()

command.addOption(new Option('-m --mode <MODE>', "Modo de ejecución del Script").choices(['dev', 'prod']).default('dev'))
command.parse()

const opts = command.opts()
const mode = opts.mode

dotenv.config({
    path: mode === 'prod' ? './.env.prod' : './.env',
    override: true
})

const config = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
    CLIENT_SECRET_GITHUB: process.env.CLIENT_SECRET_GITHUB,
    MESSAGE: process.env.MESSAGE,
    SECRET: process.env.SECRET,
    URL_CAL: process.env.URL_CAL,
    USER_GMAIL: process.env.USER_GMAIL,
    PASS_GMAIL: process.env.PASS_GMAIL,
    mode: mode
}
  
module.exports = config