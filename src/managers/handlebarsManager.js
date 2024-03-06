const fs = require('fs');
const path = require('path')

class HandlebarsManager{
    constructor(path) {
        this.path = path;
    }

    getProducts() {
        const filePath = path.join(__dirname, '../data/products.json');
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error al leer el archivo JSON de productos:', error);
            throw error; 
        }
    }
}
    
module.exports = HandlebarsManager;