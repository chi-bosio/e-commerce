class UserDTO{
    constructor({_id, username, email, role, age}){
        this.id = _id
        this.username = username
        this.email = email
        this.role = role
        this.age = age
    }
}

module.exports = UserDTO