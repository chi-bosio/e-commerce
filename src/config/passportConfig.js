const passport = require('passport')
const github = require('passport-github2').Strategy
const local = require('passport-local')
const bcrypt = require('bcrypt')

const UserManager = require('../dao/managers/userManager')
const userModel = require('../dao/models/userModel')
const config = require('./config')

const um = new UserManager()

const passportConfig = () => {
    passport.use(
        'register',
        new local.Strategy(
            {
                usernameField:"email",
                passReqToCallback: true
            },
            async (req, email, password, done) => {
                try {
                    let {username, role} = req.body
                    if(!username || !email || !password){
                        return done(null, false, {message:"Complete los datos faltantes"})
                    }

                    let userExist = await um.getUserByFilter({email})
                    if(userExist){
                        return done(null, false, {message:"Usuario existente"})
                    }

                    const hashedPass = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                    const newUser = await um.addUser(username, email, hashedPass, role)
                    return done(null, newUser)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        'github',
        new github(
            {
                clientID: config.CLIENT_ID_GITHUB,
                clientSecret: config.CLIENT_SECRET_GITHUB,
                callbackURL: 'http://localhost:8080/api/sessions/calGithub'
            },
            async (accessToken, refreshToken, profile, done) => {
                try{                
                    let name = profile._json.username
                    let email = profile._json.email
                    let user = await userModel.findOne({email})
                    if(!user){
                        user = await userModel.create({name, email, profileGithub: profile})
                    }
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
            async (username, password, done)=>{
                try {
                    let user = await um.getUserByFilter({email: username})
                    if(!user){
                        res.setHeader('Content-Type','application/json');
                        return res.status(401).json({error:`Credenciales incorrectas`})
                    }

                    let validaPassword = (user, password) => bcrypt.compareSync(password, user.password)
                    if(!validaPassword){
                        return done(null, false, {message:`Credenciales inválidas`})
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
        const user = await um.getUserByFilter({_id: id})
        return done(null, user)
    })
}

module.exports = passportConfig