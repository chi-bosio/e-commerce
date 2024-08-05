const passport = require('passport')
const github = require('passport-github2')
const local = require('passport-local')
const {createHash, validatePassword} = require('../utils/utils')
const config = require('./config')
const {userRepository, cartRepository} = require('../services/service')

const passportConfig = () => {
    passport.use(
        'register',
        new local.Strategy(
            {
                usernameField:"email",
                passReqToCallback: true
            },
            async (req, username, password, done) => {
                try {
                    let {username, email} = req.body
                    if(!username || !email){
                        return done(null, false, {message:"Complete los datos faltantes"})
                    }

                    let userExist = await userRepository.getUserBy({email})
                    if(userExist){
                        return done(null, false, {message:"Usuario existente"})
                    }

                    let role = 'user'
                    if(email === 'admin@gmail.com'){
                        role = 'admin'
                    }

                    const newCart = await cartRepository.createCart()
                    const cid = newCart._id.toString()

                    password = createHash(password)
                    let newUser = await userRepository.createUser({
                        username, email, password,
                        age: req.body.age,
                        cart: cid,
                        role
                    })

                    return done(null, newUser)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        'github',
        new github.Strategy(
            {
                clientID: config.CLIENT_ID_GITHUB,
                clientSecret: config.CLIENT_SECRET_GITHUB,
                callbackURL: config.URL_CAL
            },
            async (accessToken, refreshToken, profile, done) => {
                try{                
                    let name = profile._json.username
                    let email = profile._json.email
                    let user = await userRepository.getUserBy({email})
                    if(!user){
                        user = await userRepository.create({name, email, profileGithub: profile})
                    }
                    return done(null, user)
                } catch(error){
                    return done(error)
                }

            }
        )
    )

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField:"email",
            },
            async (username, password, done) => {
                try {
                    let user = await userRepository.getUserBy({email: username})
                    if(!user){
                        return done(null, false, {message:`Credenciales incorrectas`})
                    }

                    if(!validaPassword(user, password)){
                        return done(null, false)
                    }

                    return done(null, user)

                } catch (error) {
                    return done(error)
                }
            }
        )
    )
    
    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userRepository.getUserBy({_id: id})
        return done(null, user)
    })
}

module.exports = passportConfig