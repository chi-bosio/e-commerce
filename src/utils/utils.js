const multer = require('multer')
const bcrypt = require('bcrypt')
const {join} = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folderName = ''
        if (file.fieldname === 'profileImage') {
            uploadPath = `${__dirname}/uploads/profiles/`;
        } else if (file.fieldname === 'productImage') {
            uploadPath = `${__dirname}/uploads/products/`;
        } else {
            uploadPath = `${__dirname}/uploads/documents/`;
        }
        cb(null, folderName)
    },

    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const createHash = pass => bcrypt.hashSync(pass, bcrypt.genSaltSync(10))

const validatePass = (user, pass) => bcrypt.compareSync(pass, user.password)

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

const routes = {
    products: join(__dirname, '../data/products.json'),
    carts: join(__dirname, '../data/carts.json')
}

module.exports = {
    upload,
    createHash,
    validatePass,
    routes
}