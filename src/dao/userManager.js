const userModel = require('./models/usersModel')

class UserManager{

    async getUserByFilter(filter){
        return await userModel.findOne(filter).lean()
    }
    
    async addUser(username, email, password, role){
        try {
            const user = await userModel.create({
                username: username,
                email: email,
                password: password,
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
}

module.exports = UserManager