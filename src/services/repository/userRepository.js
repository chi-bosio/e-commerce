const UserDAO = require('../../dao/userDao')

class UserRepository{
    constructor(){
        this.userRepository = new UserDAO();
    }

    async createUser(user){
        return await this.userRepository.createUser(user)
    }

    async getUserBy(filter){
        return await this.userRepository.getUserBy(filter)
    }

    async updateLastConnection(uid){
        return await this.userRepository.updateLastConnection(uid);
    }

    async deleteInactiveUsers(){
        return await this.userRepository.deleteInactiveUsers();
    }

    async updateDocuments(uid, documents){
        return await this.userRepository.updateDocuments(uid, documents);
    }
}

module.exports = UserRepository