const passport = require('passport')
const local = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const UserManager = require('../dao/userManager')
const um = new UserManager()

const passportConfig = () => {
    passport.use(
        "register",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true,
            },
            async function (req, email, password, done) {
            try {
                    const { username, role } = req.body;
        
                    if (!username || !email || !password) {
                        return done(null, false, { message: "Username, email, y password son requeridos" });
                    }
        
                    const userExists = await um.getUserByFilter({ email });
                    
                    if (userExists) {
                        return done(null, false, { message: "Usuario existente" });
                    }
            
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newUser = await um.addUser(username, email, hashedPassword, role);
                    
                    return done(null, newUser);
                } catch (error) {
                    return done(error);
                }
            }
        )
    )

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField: "email",
                passReqToCallback: true,
            },
            async function (req, email, password, done) {
                try {
                    const user = await um.getUserByFilter({ email });
                    
                    if (!user) {
                        return done(null, false, { message: "Usuario no encontrado" });
                    }
                    
                    const validate = await bcrypt.compare(password, user.password);
                    console.log('validación de passwords: ', validate)
                    console.log('password según DB: ', password)
                    console.log('password según usuario: ', user.password)
                    
                    if (!validate) {
                        return done(null, false, { message: "Contraseña incorrecta" });
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await um.getUserByFilter({ _id: id });
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

module.exports = passportConfig