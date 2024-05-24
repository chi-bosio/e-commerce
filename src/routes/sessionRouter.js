const {session} = require('passport')
const passport = require('passport')
const SessionController = require('../controller/sessionController')
const authenticate = require('../middlewares/auth')

const Router = require('express').Router
const router = Router()


router.get('/', SessionController.getUsers)

router.get('/current', authenticate, SessionController.currentUser)

router.get('/registerError', SessionController.registerError)

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
    passport.authenticate('githubLogin', {}),
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