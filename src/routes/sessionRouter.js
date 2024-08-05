const {session} = require('passport')
const passport = require('passport')
const SessionController = require('../controller/sessionController')
const authenticate = require('../middlewares/auth')

const Router = require('express').Router
const router = Router()


router.get('/', SessionController.getUsers)

router.get('/registerError', SessionController.registerError)

router.post(
    '/register',
    passport.authenticate(
        'register', {failureRedirect: '/api/sessions/registerError'}
    ),
    SessionController.register
)
router.get('/loginError', SessionController.loginError)

router.post(
    '/login', 
    passport.authenticate(
        'login', {failureRedirect: '/api/sessions/loginError'}
    ), 
    SessionController.login
)

router.get(
    '/github',
    passport.authenticate('github', {}),
    async (req, res) => {}
)

router.get('/errorGithub', SessionController.githubError)

router.get(
    '/calGithub',
    passport.authenticate(
        'github', {failureRedirect: '/api/sessions/errorGithub'}
    ),
    SessionController.calGithub
)

router.get('/logout', SessionController.logout)


module.exports = router