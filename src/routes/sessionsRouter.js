const UserManager = require('../dao/userManager')
const userModel = require('../dao/models/usersModel')

const Router = require('express').Router
const router = Router()

const um = new UserManager()

router.post('/register', async (req, res) => {
    const {
        username,
        email,
        password,
        role
    } = req.body

    try {
        if(!username || !email || !password || !role){
            res.status(400).json({ error: 'Completar todos los campos' });
        }

        if(await um.getUserByFilter({email})){
            res.status(400).json({ error: 'Email existente!!' });
        }

        const user = await um.addUser(username, email, password, role)
        req.session.user = user
        
        res.status(201).json(user)
    } catch (error) {
        return res.redirect("/register?error=registerError");
    }
})

router.get('/', async (req, res) => {
    try {
        const user = await um.getUsers()
        res.json(user)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

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