const Router = require('express').Router
const passport = require('passport')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')

const userModel = require('../dao/models/userModel')
const {ensureAuthenticated} = require('../middlewares/auth')

const router = Router()
dotenv.config()

// REGISTER

router.get('/register', async (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {

    const {first_name, last_name, email, age, password, role} = req.body
    if(!first_name || !last_name || !email || !age || !password){
        return res.status(400).json({error:'Completar todos los datos'})
    }

    const existUser = await userModel.findOne({email})
    if(existUser){
        return res.status(400).json({error: 'Ya existe usuario con ese email'})
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    const user = new userModel({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
        role
    })

    await user.save()

    const token = jwt.sign({user}, process.env.JWT_SECRET, {
        expiresIn: '24h'
    })

    res.cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        signed: true
    })

    res.redirect('/api/sessions/login')
})

// router.get('/registerError', async (req, res) => {
//     res.redirect('/register?message=Error en registro')
// })
// LOGIN

router.get('/login', async (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body
    
    let user = await userModel.findOne({email})
    if(!user){
        return res.status(401).json({error: 'Usuario no encontrado'})
    }

    const isValidPass = await bcrypt.compare(password, user.password)
    if(!isValidPass){
        return res.status(401).json({error: 'Contraseña incorrecta'})
    }

    user = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
    delete user.password

    const token = jwt.sign({user}, process.env.JWT_SECRET, {
        expiresIn: '24h'
    })

    res.cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        signed: true
    })

    res.status(200).json({userLogued: user})
})

// router.get('/loginError', async (req, res) => {
//     res.redirect('/login?error=Error en login')
// })

router.get('/logout',ensureAuthenticated, async (req, res) => {
    try {
        if(req.user){
            res.clearCookie(process.env.COOKIE_NAME)
            res.redirect('/api/sessions/login')
        }
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// GITHUB

router.get(
    '/github',
    passport.authenticate('github', {}),
    async (req, res) => {})

router.get(
    '/calGithub',
    passport.authenticate('github', {
        failureRedirect: '/api/sessions/errorGithub',
        session: false
    }),
    async (req, res) => {
        let user = req.user

        if(user){
            let token = jwt.sign({user}, process.env.JWT_SECRET, {
                expiresIn: '24h'
            })

            res.cookie(process.env.COOKIE_NAME, token, {
                httpOnly: true,
                signed: true
            })

            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({ message: "Sesión iniciada", user: user });
        } else{
            res.setHeader("Content-Type", "application/json");
            return res.status(401).json({ error: "Error al inicar sesión con Github" });
        }
    }
)

router.get('/errorGithub', async (req, res) => {
    res.setHeader('Content-Type','application/json');
    return res.status(500).json({error:'Error al iniciar sesión con Github'})
})

// PROFILE

router.get('/profile', ensureAuthenticated, async (req, res) => {
    res.setHeader('Content-Type','application/json');
    return res.status(200).json(req.user);
})

module.exports = router