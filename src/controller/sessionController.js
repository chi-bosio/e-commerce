const UserRepository = require('../services/repository/userRepository')
const UserDTO = require('../services/dto/userDTO')
const logger = require('../config/logger')
const {createHash, validatePass} = require('../utils/utils')
const userModel = require('../dao/models/userModel')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const sendEmail = require('../config/sendEmail')
const bcrypt = require('bcrypt')

class SessionController{
    static async registerError(req, res){
        res.send('Registro fallido')
    }

    static async register(req, res){
        const {username, email, password} = req.body
        if(!username || !email || !password){
            return res.redirect('/register?error=Faltan datos')
        }

        try {
            res.setHeader('Content-Type', 'application/json')
            res.redirect(`http://localhost:${config.PORT}/`)
        } catch (error) {
            req.logger.error(error)
            return res.status(400).json({error: 'Error inesperado'})
        }
    }

    static async loginError(req, res){
        res.setHeader('Content-Type', 'application/json')
        res.status(401).json({error: 'Fallo login'})
    }

    static async login(req, res){
        let {email, password} = req.body
        if(!email || !password){
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: 'Faltan datos' })
        }

        let user = await UserRepository.getUserBy({email})
        if(!user){
            res.setHeader('Content-Type', 'application/json');
            return res.status(401).json({ error: `Credenciales incorrectas` })
        }

        if(user.password !== createHash(password)){
            if(!validatePass(user, password)){
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({ error: `Credenciales incorrectas` })
            }
        }
        user = {...user}
        delete user.password
        req.session.user = user
        UserRepository.updateLastConnection(user._id)

        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({message: "Login correcto", user})
    }

    static async githubError(req, res){
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error: 'Error en el servidor',
                detalle: 'Error en login con Github'
            }
        )
        
    }

    static async calGithub(req, res){
        req.session.user = req.user
        return res.redirect(`http://localhost:${config.PORT}/products`)
    }

    static async logout(req, res){
        UserRepository.updateLastConnection(req.session.user._id)
        req.session.destroy(err => {
            if(err){
                res.setHeader('Content-Type', 'application/json');
                res.status(500).json({error: 'Error interno. Intente más tarde.', detalle: err.message})
            }
        })

        res.setHeader('Content-Type', 'application/json')
        res.status(200).json({message: 'Logout exitoso'})
    }

    static async current(req, res){
        if(req.session.user){
            const userDTO = new UserDTO(req.session.user)
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json(userDTO)
        } else{
            res.setHeader('Content-Type', 'application/json')
            return res.status(401).json({error: 'No hay un usuario logueado'})
        }
    }

    static async recoverPassword(req, res){
        try {
            const {email} = req.body
            const user = await userModel.findOne({email})
    
            if (!user) {
                logger.error(`No se encontro usuario con email ${email}`)
                return res.status(401).json({error: 'Credenciales incorrectas'})
            }
    
            logger.info(`Se encontró usuario con email ${email}`)
    
            const token = jwt.sign({email}, config.SECRET, {expiresIn: '24h'})
            const subject = 'Recuperar contraseña'
            const message = `<h1>Recupere su contraseña</h1>
            <p>Haga click en este enlace para recuperar su contraseña:</p> 
            <a href="http://localhost:${config.PORT}/resetpassword?token=${token}">Recuperar contraseña</a>`
    
            await sendEmail(user.email, subject, message)
            res.status(200).json({message: 'Se envió un correo electrónico para recuperar su contraseña' })
        } catch (error) {
            logger.error('Error al recuperar la contraseña', error)
            return res.status(400).json({error: 'Error inesperado'})
        }
    }

    static async changePassword(req, res){
        const {password} = req.body
        const {token} = req.query
        try {
            if (!token) {
                logger.error("Token invalido")
                return res.status(400).json({error: 'Token inválido'})
            }
    
            if (!password) {
                logger.error('Contraseña inválida')
                return res.status(400).json({error: 'Contraseña inválida'})
            }
    
            try {
                const decoded = jwt.verify(token, config.SECRET)
                logger.info('Token verificado', decoded)
                const {email} = decoded
                const user = await userModel.findOne({email})
    
                if (!user) {
                    logger.error('No se encontró usuario')
                    return res.status(401).json({error: 'Credenciales incorrectas'})
                }
    
                const passwordMatch = bcrypt.compareSync(password, user.password)
                if (passwordMatch) {
                    logger.error('La nueva contraseña no puede ser igual a la anterior')
                    return res.status(400).json({error: 'La nueva contraseña no puede ser igual a la anterior'})
                }
    
                const hashedPassword = createHash(password)
                await userModel.updateOne({email}, {password: hashedPassword})
                logger.info('Contraseña actualizada')
                return res.status(200).json({message: 'Contraseña actualizada'})
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    logger.error("Token expirado")
                    return res.render('forgotPassword', {error: 'Token expirado'})
                }
                logger.error('Error al cambiar la contraseña', error)
                return res.status(400).json({error: 'Error inesperado'})
            }
        } catch (error) {
            logger.error('Error al cambiar la contraseña', error)
            return res.status(400).json({error: 'Error inesperado'})
        }
    }
}
module.exports = SessionController