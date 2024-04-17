const UserManager = require('../dao/userManager')
const userModel = require('../dao/models/usersModel')

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

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    try {
        if(!username || !password){
            return res.render('/login?error=missingFields')
        }

        const user = await um.authenticateUser(username, password)
        req.session.user = user
        res.redirect('/products')
    } catch (error) {
        return res.redirect("/login?error=invalidCredentials");
    }
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