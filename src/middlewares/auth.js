const config = require('../config/config')

const authenticate = (req, res, next) => {
    if(!req.session.user){
        return res.redirect(`http://localhost:${config.PORT}/`)
    }
    next()
};

const admin = (req, res, next) => {
    if (req.session.user.role !== 'admin') {
        return res.redirect(`http://localhost:${config.PORT}/products`)
    } 
    next()
}

const user = (req, res, next) => {
    if (req.session.usuario.rol === 'admin') {
        return res.redirect(`http://localhost:${config.PORT}/realTimeProducts`)
    }
    next()
}

module.exports = {
    authenticate,
    admin,
    user
}