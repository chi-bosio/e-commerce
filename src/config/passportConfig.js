const passport = require('passport')
const github = require('passport-github2')
const jwt = require('passport-jwt')
const dotenv = require('dotenv')
const userModel = require('../dao/models/userModel')

dotenv.config()
const searchToken = (req) => {
    let token = null

    if(req.signedCookies.ecommerce){
        console.log('Cookie encontrada');
        token = req.signedCookie.ecommerce
    }

    return token
}

const initPassport = () => {
    passport.use(
        'jwt',
        new jwt.Strategy(
            {
                secretOrKey: process.env.COOKIE_SECRET,
                jwtFromRequest: new jwt.ExtractJwt.fromExtractors([searchToken]),
                passReqToCallback: true
            },
            async (req, jwtPayload, done) => {
                try {
                    const user = await userModel.findById(jwtPayload.id)

                    if(!user){
                        return done(null, false, {message: 'El usuario no ha sido encontrado'})
                    }
                    
                    req.user = user

                    return done(null, user)
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
                clientID: process.env.CLIENT_ID_GITHUB,
                clientSecret: process.env.CLIENT_SECRET_GITHUB,
                callbackURL: 'http://localhost:8080/api/sessions/calGithub'
            },
            async function(accessToken, refreshToken, profile, done){
                try{
                    let fullName = profile._json.name
                    let email = profile._json.email

                    if(!email){
                        return done(null, false)
                    }

                    let name = fullName.split(' ')
                    let user = await userModel.findOne({email: email})

                    if(!user){
                        user = await userModel.create(
                            {
                                first_name: name[0],
                                last_name: name[1],
                                email,
                                profileGithub: profile
                            }
                        )
                    }

                    return done(null, user)
                } catch(error){
                    return done(error)
                }

            }
        )
    )
}

module.exports = initPassport