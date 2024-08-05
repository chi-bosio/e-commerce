const path = require('path')
const multer = require('multer')
const bcrypt = require('bcrypt')

const __dirname = path.resolve()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folderName = ''
        switch (file.fieldName){
            case 'profiles': 
                folderName = 'profiles'
            case 'products':
                folderName = 'products'
            case 'documents':
                folderName = 'documents'
            default:
                folderName = 'others'
        }
        cb(null, file.originalName)
    },

    filename: function(req, file, cb){
        cb(null, file.originalName)
    }
})

const createHash = pass => bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
const validatePass = (user, pass) => bcrypt.compareSync(pass, user.pass)

const upload = multer({
    storage,
    onError: function(error, next){
        next()
    }
}).fields([
    {name: 'identification', maxCount: 1},
    {name: 'comprobantAdress', maxCount: 1},
    {name: 'comprobantAccountStatus', maxCount: 1}
])

module.exports = {
    __dirname,
    upload,
    createHash,
    validatePass
}