const UserManager = require('../dao/managers/userManager')
const userModel = require('../dao/models/userModel')

const Router = require('express').Router
const passport = require('passport')

const router = Router()
const um = new UserManager()

router.get('/', async (req, res) => {
    try {
        const user = await um.getUsers()
        res.json(user)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.get('/registerError', async (req, res) => {
    res.redirect('/register?message=Error en registro')
})

router.post('/register', passport.authenticate('register', {
        failureRedirect: '/api/sessions/registerError'
    }),
    async (req, res) => {
        return res.redirect('/register?message=Registro correcto!!')
    }
)

router.get('/loginError', async (req, res) => {
    res.redirect('/login?error=Error en login')
})

router.post('/login', passport.authenticate('login', {
        failureRedirect: '/api/sessions/loginError'
    }),
    async (req, res) => {
        const user = req.user
        user = {...user}
        delete user.password
        req.session.user = user
        req.setHeader('Content-Type', 'application/json')
        return res.redirect('/api/products')
})

router.get('/logout', async (req, res) => {
    try {
        req.session.destroy(error => {
            if(error){
                res.status(500).send({ error: 'Error al cerrar sesión', error });
            } else{
                res.redirect('/api/sessions/login')
            }
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports = router