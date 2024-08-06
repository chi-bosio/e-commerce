const passport = require('passport')
const SessionController = require('../controller/sessionController')

const Router = require('express').Router
const router = Router()

router.get('/registerError', SessionController.registerError)

router.get('/loginError', SessionController.loginError)

router.get('/logout', SessionController.logout)

router.get(
    '/github',
    passport.authenticate('github', {}),
    async (req, res) => {}
)

router.get(
    '/calGithub',
    passport.authenticate(
        'github', {failureRedirect: '/api/sessions/errorGithub'}
    ),
    SessionController.calGithub
)

router.get('/errorGithub', SessionController.githubError)

router.get('/current', SessionController.current)


router.post(
    '/register',
    passport.authenticate(
        'register', {failureRedirect: '/api/sessions/registerError'}
    ),
    SessionController.register
)

router.post(
    '/login', 
    passport.authenticate(
        'login', {failureRedirect: '/api/sessions/loginError'}
    ), 
    SessionController.login
)

router.post('/recoverpass', SessionController.recoverPassword)

router.post('/changepass', SessionController.changePassword)


module.exports = router