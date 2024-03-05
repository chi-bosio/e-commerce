const fs = require('fs');

class HandlebarsManager{
    constructor(path) {
        this.path = path;
    }

    async getProducts(){
        if(fs.existsSync(this.path)){
            return fs.readFileSync('../data/carts.json', 'utf-8')
        } else{
            return []
        }
    }
}
    
module.exports = HandlebarsManager;