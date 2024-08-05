const faker = require('@faker-js/faker')

function generateMockProducts(count = 100){
    const products = []
    for(let i = 0; i < count; i++){
        products.push({
            _id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            description: faker.lorem.sentence(),
            price: faker.number.int({min: 1, max: 100}),
            thumbnail: faker.image.url(),
            code: `P${i}`,
            stock: faker.number.int({min: 1, max: 50}),
            status: true,
            category: faker.commerce.department()
        })
    }
    return products
}

module.exports = generateMockProducts