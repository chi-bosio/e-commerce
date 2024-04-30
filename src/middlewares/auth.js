const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const userModel = require('../dao/models/userModel')

dotenv.config()

function ensureAuthenticated(req, res, next){
    let token = null

    if(req.signedCookies.ecommerce){
        token = req.signedCookies.ecommerce
    }

    if(!token){
        return res.status(401).json({error:'No existen usuarios autenticados'})
    }

    try {
        const decoded = jwt.verify(token, process.env.COOKIE_SECRET)
        req.user = decoded
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error interno en el servidor`, error: error.message})
    }

    next()
}

function ensureAccess(access = []){
    return async (req, res, next) => {
        access = access.map(i => i.toLowerCase())

        if(access.includes('public')){
            return next()
        }

        try {
            if(!req.user.user._id){
                res.setHeader('Content-Type','application/json')
                return res.status(401).json({error:'No existen usuarios'})
            }

            if (!access.includes(req.user.user.role)) {
                res.setHeader("Content-Type", "application/json");
                return res.status(403).json({ error: `No tiene permiso` });
              }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }

        next()
    }
}

module.exports = {
    ensureAuthenticated,
    ensureAccess
}