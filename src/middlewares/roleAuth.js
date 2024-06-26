function isAdmin(req, res, next){
    if(req.session.user && req.session.user.role === 'admin'){
        return next()
    }
    return res.status(403).json({error: 'Solo los administradores pueden realizar esta acción!!!'})
}

function isUser(req, res, next){
    if(req.session.user && req.session.user.role === 'user'){
        return next()
    }
    return res.status(403).json({error: 'Solo los usuarios pueden realizar esta acción!!!'})
}

module.exports = {isAdmin, isUser}