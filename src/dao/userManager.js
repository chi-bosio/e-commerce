const userModel = require('./models/usersModel')
const bcrypt = require('bcrypt')

class UserManager{

    async getUserByFilter(filter){
        return await userModel.findOne(filter).lean()
    }
    
    async addUser(username, email, password, role){
        try {
            const hashedPassword = await bcrypt.hash(password, 8)
            const user = await userModel.create({
                username: username,
                email: email,
                password: hashedPassword,
                role: role
            })
            return user
        } catch (error) {
            throw new Error("Error al agregar al usuario: " + error.message);
        }
    }

    async getUsers(){
        try {
            const user = await userModel.find();
            return user
        } catch (error) {
            throw new Error("Error al obtener los usuarios: " + error.message);
        }
    }

    async authenticateUser(username, password){
        try {
            const user = await userModel.findOne({username}).lean()

            if(!user){
                throw new Error('Usuario no encontrado')
            }

            const passwordCorrect = await bcrypt.compare(password, user.password)
            if(!passwordCorrect){
                throw new Error('Contraseña incorrecta')
            }

            return user
        } catch (error) {
            throw new Error("Error al autenticar el usuario: " + error.message);
        }
    }
}

module.exports = UserManager