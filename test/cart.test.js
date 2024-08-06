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

describe('Testing Router Cart', () => {
    describe('GET /api/carts', async () => {
        it('Obtiene todso los carritos', async () => {
            const {_body, status, ok, headers} = await requester.get('/api/carts')

            expect(_body.carts).to.be.a('array')
            expect(status).to.be.equal(200)
            expect(ok).to.be.true
            expect(headers['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    })

    describe('GET /api/carts/:cid', async () => {
        let cookie
        let token
        it('Obtiene carrito por ID', async () => {
            const tokenResponse = await requester
                .post('/api/sessions/login')
                .send({email: 'test@testing.com'})
            cookie = tokenResponse.headers['set-cookie'][0].split(';')[0]
            token = cookie.split('=')[1]

            const {_body, status, ok} = await requester
                .get('/api/carts/6609edcd4460620700a73265')
                .set('Cookie', `${cookie}`)
                .set('authorization', `Bearer ${token}`)

            expect(_body).to.be.a("object")
            expect(_body.cart).to.have.property("_id")
            expect(status).to.be.equal(200)
            expect(ok).to.be.true
        })

        it('Retorna error 500 si el ID del carrito es inválido', async () => {
            const {status, ok} = await requester
              .get('/api/carts/invalidID')
              .set('Cookie', `${cookie}`)
              .set('authorization', `Bearer ${token}`)
      
            expect(status).to.be.equal(500)
            expect(ok).to.be.false
        })
    })

    describe('POST /api/carts', async () => {
        it('Crea un carrito', async () => {
            const initialProducts = [
                {pid: 'product1', quantity: 2},
                {pid: 'product2', quantity: 1}
            ]
    
            const {status, ok, body, header} = await requester
                .post('/api/carts')
                .send({products: initialProducts})
                .set('Cookie', `${cookie}`)
                .set('authorization', `Bearer ${token}`);
    
            expect(status).to.be.equal(200)
            expect(ok).to.be.true
            expect(body).to.be.a('object')
            expect(body).to.have.property('_id')
            expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    
        it('Crea un carrito vacío si no se proporcionan productos', async () => {
            const {status, ok, body, header} = await requester.post('/api/carts').send({})
    
            expect(status).to.be.equal(200)
            expect(ok).to.be.true
            expect(body).to.be.a('object')
            expect(body).to.have.property('_id')
            expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    
        it('Retorna error 500 si hay un error del servidor', async () => {
            const createCartStub = sinon
                .stub(CartService, 'createCart')
                .throws(new Error('Internal Server Error'))
    
            const {status, ok, body, header} = await requester
                .post('/api/carts')
                .send({})
                .set('Cookie', `${cookie}`)
                .set('authorization', `Bearer ${token}`)
    
            expect(status).to.be.equal(500)
            expect(ok).to.be.false
            expect(body).to.have.property('error')
            expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
    
            createCartStub.restore()
        })
    })

    describe('POST /api/carts/:cid/products', async () => {
        let cookie
        let token
        it('Agrega un producto al carrito', async () => {
          const tokenResponse = await requester
            .post('/api/sessions/login')
            .send({email: 'test@testing.com', password: '123456789'})
          cookie = tokenResponse.headers['set-cookie'][0].split(';')[0]
          token = cookie.split('=')[1]
    
          const {status, ok, body, header} = await requester
            .post('/api/carts/668367ff9238979d05a272b2/products')
            .send({quantity: 1, price: 40000000})
            .set('Cookie', `${cookie}`)
            .set('authorization', `Bearer ${token}`)
    
          expect(status).to.be.equal(200)
          expect(ok).to.be.true
          expect(body).to.be.a('object')
          expect(body.cart).to.have.property('_id')
          expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    
        it('Retorna error 400 si es el propietario del producto', async () => {
          const tokenResponse = await requester
            .post('/api/sessions/login')
            .send({email: 'chiarabosio@gmail.com', password: 'chi123'})
          cookie = tokenResponse.headers['set-cookie'][0].split(';')[0]
          token = cookie.split('=')[1]
    
          const {status, ok, body, header} = await requester
            .post('/api/carts/666f62cdc5ba9dde9455f105/products')
            .send({quantity: 1, price: 40000000})
            .set('Cookie', `${cookie}`)
            .set('authorization', `Bearer ${token}`)
    
          expect(status).to.be.equal(400)
          expect(ok).to.be.false
          expect(body.message).to.be.equal('No puedes agregar tu propio producto al carrito')
          expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    
        it('Retorna un error 500 si el ID del carrito o el ID del producto es inválido', async () => {
          const {status, ok, body, header} = await requester
            .post('/api/carts/invalid-cid/products/invalid-pid')
            .send({quantity: 1})
            .set('Cookie', `${cookie}`)
            .set('authorization', `Bearer ${token}`)
    
          expect(status).to.be.equal(500)
          expect(ok).to.be.false
          expect(body).has.property('error')
          expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    })
    
    describe('POST /api/carts/:cid/purchase', async () => {
        it('Compra un carrito', async () => {
          const {status, ok, body, header} = await requester.post(
            '/api/carts/6684462d2a936fd71c992ca9/purchase'
          )
    
          expect(status).to.be.equal(200)
          expect(ok).to.be.true
          expect(body).to.be.a('object')
          expect(body.message).to.be.equal('Compra realizada con éxito')
          expect(body.ticket).to.have.property('_id')
          expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    
        it('Retorna error 404 si u producto no tiene stock', async () => {
          const {status, ok, body, header} = await requester.post(
            '/cart/666f62cdc5ba9dde9455f105/purchase'
          )
    
          expect(status).to.be.equal(404)
          expect(ok).to.be.false
          expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    
        it('Retorna error 500 si el ID del carrito es inválido', async () => {
          const {status, ok, body, header} = await requester.post(
            '/cart/invalid-cid/purchase'
          )
    
          expect(status).to.be.equal(500)
          expect(ok).to.be.false
          expect(body).have.property('error')
          expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    })

    describe('PUT /api/carts/:cid/products/:pid', async () => {
        it('Actualiza la cantidad de un producto', async () => {
          const {status, ok, body, header} = await requester
            .put('/api/carts/668367ff9238979d05a272b2/products/65ffacfc3c8dee81c814ab08')
            .send({quantity: 1})
    
          expect(status).to.be.equal(200)
          expect(ok).to.be.true
          expect(body).to.be.a('object')
          expect(body.cart).to.have.property('_id')
          expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    
        it('Retorna un error 500 si el Id del carrito o el ID del producto es inválido', async () => {
          const {status, ok, body, header} = await requester
            .put('/api/carts/invalid-cid/products/invalid-pid')
            .send({quantity: 1})
    
          expect(status).to.be.equal(500)
          expect(ok).to.be.false
          expect(body).has.property('error')
          expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    })

    describe('DELETE /api/carts/:cid/products/:pid', async () => {
        it('Elimina un producto del carrito', async () => {
          const {status, ok, body, header} = await requester.delete(
            '/api/carts/668367ff9238979d05a272b2/products/65ffacfc3c8dee81c814ab08'
          )
    
          expect(status).to.be.equal(200)
          expect(ok).to.be.true
          expect(body).to.be.a('object')
          expect(body.cart).to.have.property('_id')
          expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    
        it('Retorna error 500 si el ID del carrito o el ID del producto es inválido', async () => {
          const {status, ok, body, header} = await requester.delete(
            '/api/carts/invalid-cid/products/invalid-pid'
          )
    
          expect(status).to.be.equal(500)
          expect(ok).to.be.false
          expect(body).has.property('error')
          expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    })

    describe('DELETE /api/carts/:cid', async () => {
        let token
        let cookie
        it('Elimina un carrito', async () => {
          const tokenResponse = await requester
            .post('/api/sessions/login')
            .send({email: 'test@testing.com', password: '123456789'})
          cookie = tokenResponse.headers['set-cookie'][0].split(';')[0]
          token = cookie.split('=')[1]

          const {status, ok, body, header} = await requester
            .delete('/api/carts/668367ff9238979d05a272b2')
            .set('Cookie', `${cookie}`)
            .set('authorization', `Bearer ${token}`)
    
          expect(status).to.be.equal(200)
          expect(ok).to.be.true
          expect(body).to.be.a('object')
          expect(body.message).to.be.equal('Carrito vacío')
          expect(body.cart).to.have.property('_id')
          expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    
        it('Retorna error 500 si el ID del carrito es inválido', async () => {
          const tokenResponse = await requester
            .post('/api/sessions/login')
            .send({email: 'test@testing.com', password: '123456789'})
          cookie = tokenResponse.headers["set-cookie"][0].split(';')[0]
          token = cookie.split('=')[1]
    
          const {status, ok, body, header} = await requester
            .delete('/api/carts/invalid-cid')
            .set('Cookie', `${cookie}`)
            .set('authorization', `Bearer ${token}`)
    
          expect(status).to.be.equal(500)
          expect(ok).to.be.false
          expect(body).has.property('error')
          expect(header['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    })
})