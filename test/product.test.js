const expect = require('chai')
const {describe, it} = require('mocha')
const config = require('../src/config/config')
const mongoose = require('mongoose')
const supertest = require('supertest')

const requester = supertest('http://localhost:8080')

const connDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URL)
    } catch (error) {
        console.log(`Error al conectar con la DB: ${error}`);
    }
} 
connDB()

describe('Testing Router Products', () => {
    this.timeout(15000)

    before(async () => {
        await connDB()
    })

    afterEach(async () => {
        await mongoose.connection.collection('products').deleteMany({category: 'pruebas'})
    })

    describe('GET /api/products', async () => {
        let cookie
        let token

        it('Retorna todos los productos', async () => {
            const tokenResponse = await requester
                .post('/api/sessions/login')
                .send({email: 'test@testing.com', password: '123456789'})
            cookie = tokenResponse.headers['set-cookie'][0].split(';')[0]
            token = cookie.split('=')[1]

            const {body, status, headers} = await requester
                .get('/api/products')
                .set('Cookie', `${cookie}`)
                .set('Authorization', `Bearer ${token}`)

            expect(status).to.equal(200)
            expect(body).to.be.an('object')
            expect(headers['content-type']).to.equal('text/html; charset=utf-8')
        })
    })

    describe('POST /api/products', async () => {
        let cookie
        let token

        it('Crea un nuevo producto', async () => {
            const tokenResponse = await requester 
                .post('/api/sessions/login')
                .send({email: 'test@testing.com', password: '123456789'})
            cookie = tokenResponse.headers['set-cookie'][0].split(';')[0]
            token = cookie.split('=')[1]

            const newProduct = {
                title: 'Prueba',
                description: 'Es un producto de prueba',
                price: 150,
                category: 'pruebas',
                stock: 18,
                thumbnail: 'prueba.jpeg',
                code: '123ABC'
            }

            const {body, status, headers, ok} = await requester
                .post('/api/products')
                .send(newProduct)
                .set('Cookie', `${cookie}`)
                .set('authorization', `Bearer ${token}`)

            expect(status).to.equal(201)
            expect(headers['content-type']).to.equal('application/json; charset=utf-8')
            expect(ok).to.be.true
            expect(body).to.be.an('object')
            expect(body.newProduct).has.property('_id')
        })

        it('Retorna error 400 si falta completar algún campo', async () => {
            const newProduct = {
                title: 'Prueba',
                description: 'Es un producto de prueba',
                price: 150,
                category: 'pruebas',
                stock: 18,
                thumbnail: 'prueba.jpeg',
                // code: '123ABC'
            }

            const {body, status, headers, ok} = await requester
                .post('/api/products')
                .send(newProduct)
                .set('Cookie', `${cookie}`)
                .set('authorization', `Bearer ${token}`)

            expect(status).to.equal(400)
            expect(headers['content-type']).to.equal('application/json; charset=utf-8')
            expect(ok).to.be.false;
            expect(body).to.be.an('object');
        })
    })

    describe('PUT /api/products/:pid', async () => {
        let cookie
        let token

        it('Actualiza un producto', async () => {
            const tokenResponse = await requester
                .post('/api/sessions/login')
                .send({email: 'chibosio@gmail.com', password: 'chi123'})
            cookie = tokenResponse.headers['set-cookie'][0].split(';')[0]
            token = cookie.split('=')[1]

            const updatedProduct = {
                title: 'Producto actualizado',
                description: 'Es un producto de prueba actualizado',
                price: 300,
                category: 'updated',
                stock: 10,
                thumbnail: 'pruebaActualizado.jpeg',
                code: 'ABC123'
            }

            const {body, status, headers, ok} = await requester
                .put('/api/products/6609ed0c2fe6b49a94c7fd81')
                .send(updatedProduct)
                .set('Cookie', `${cookie}`)
                .set('authorization', `Bearer ${token}`)

            expect(status).to.be.equal(200)
            expect(headers['content-type']).to.equal('application/json; charset=utf-8')
            expect(ok).to.be.true
            expect(_body).to.be.an('object')
        })

        it('Retorna error 400 si el producto no existe', async () => {
            const updatedProduct = {
                title: 'Producto actualizado',
                description: 'Es un producto de prueba actualizado',
                price: 300,
                category: 'updated',
                stock: 10,
                thumbnail: 'pruebaActualizado.jpeg',
                code: 'ABC123'
            }

            const {status, headers, ok} = await requester
              .put('/api/products/6609ed0c2fe6b49a94c7fd81')
              .send(updatedProduct)
              .set('Cookie', `${cookie}`)
              .set('authorization', `Bearer ${token}`)
      
            expect(status).to.equal(404)
            expect(headers['content-type']).to.equal('application/json; charset=utf-8')
            expect(ok).to.be.false
          })

        it('Retorna error 403 si no tiene  permiso para actualizar el producto', async () => {
            const tokenResponse = await requester
                .post('/api/sessions/login')
                .send({ email: 'chiarabosio@test.com', password: '1234chi' })
            cookie = tokenResponse.headers['set-cookie'][0].split(';')[0]
            token = cookie.split('=')[1]
        
            const updatedProduct = {
                title: 'Producto actualizado',
                description: 'Es un producto de prueba actualizado',
                price: 300,
                category: 'updated',
                stock: 10,
                thumbnail: 'pruebaActualizado.jpeg',
                code: 'ABC123'
            };

            const {status, headers, ok} = await requester
                .put('/api/products/6609ed0c2fe6b49a94c7fd81')
                .send(updatedProduct)
                .set('Cookie', `${cookie}`)
                .set('authorization', `Bearer ${token}`)
        
            expect(status).to.equal(403)
            expect(headers["content-type"]).to.equal('application/json; charset=utf-8')
            expect(ok).to.be.false;
        })
    })

    describe('DELETE /api/products/:pid', async () => {
        let cookie
        let token

        it('Elimina un producto', async () => {
          const tokenResponse = await requester
            .post('/api/sessions/login')
            .send({ email: 'test@testing.com', password: '123456789' })
      
          cookie = tokenResponse.headers['set-cookie'][0].split(';')[0]
          token = cookie.split('=')[1]
      
          const {body, status, headers, ok} = await requester
            .delete('/api/products/6609ed0c2fe6b49a94c7fd81')
            .set('Cookie', `${cookie}`)
            .set('authorization', `Bearer ${token}`)
      
          expect(status).to.equal(200)
          expect(headers['content-type']).to.equal('application/json; charset=utf-8')
          expect(body).to.be.an('object')
          expect(ok).to.be.true
        })
      
        it('Retorna error 403 si no tiene autorización para eliminar el producto', async () => {
          const tokenResponse = await requester
            .post('/api/sessions/login')
            .send({email: 'tito@test.com', password: '123'})

          cookie = tokenResponse.headers['set-cookie'][0].split(';')[0]
          token = cookie.split('=')[1]
      
          const {status, headers, ok} = await requester
            .delete('/api/products/66844a75d02ed08218da7c5f')
            .set('Cookie', `${cookie}`)
            .set('authorization', `Bearer ${token}`)
      
          expect(status).to.equal(403)
          expect(headers['content-type']).to.equal('application/json; charset=utf-8')
          expect(ok).to.be.false
        })
      
        it('Retorna error 404 si no se encuentra el producto', async () => {
          const tokenResponse = await requester
            .post('/api/sessions/login')
            .send({email: 'test@testing.com', password: '123456789'})

          cookie = tokenResponse.headers['set-cookie'][0].split(';')[0]
          token = cookie.split('=')[1]
      
          const {status, headers, ok} = await requester
            .delete('/api/products/6609ed0c2fe6b49a94c7fd81')
            .set('Cookie', `${cookie}`)
            .set('authorization', `Bearer ${token}`)
      
          expect(status).to.equal(404)
          expect(headers['content-type']).to.equal('application/json; charset=utf-8')
          expect(ok).to.be.false
        })
    })
})