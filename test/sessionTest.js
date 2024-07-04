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

describe('Testing Router Sessions', function () {
    this.timeout(10000)
  
    after(async () => {await mongoose.connection.collection('users').deleteMany({first_name: 'test'})})
  
    describe('GET /api/sessions/current', () => {
        let cookie
  
        it('Retorna un usuario', async () => {
            const tokenResponse = await requester
                .post('/api/sessions/login')
                .send({email: 'test@testing.com', password: '123456789'})
            cookie = tokenResponse.headers['set-cookie'][0].split(';')[0]
  
            const {body, status, ok, headers} = await requester
                .get('/api/sessions/current')
                .set('Cookie', `${cookie}`)
  
            expect(body).to.be.a('object')
            expect(body.perfil).has.property('email')
            expect(status).to.be.equal(200)
            expect(ok).to.be.true
            expect(headers['content-type']).to.be.equal('application/json; charset=utf-8')
        })
    })

    describe('POST /api/sessions/register', () => {
        it('Redirecciona a /api/sessions/login', async () => {
            const mockUser = {
                first_name: 'test',
                last_name: 'test',
                email: 'abc@test.com',
                password: '123',
                age: 21,
                role: 'user'
            }
  
            const {request, headers} = await requester
                .post('/api/sessions/register')
                .send(mockUser)
  
            const cookie = headers['set-cookie'][0].split('=')[0]
            const cookieSecret = config.DB_NAME
            
            expect(request._data).to.be.a('object')
            expect(request._data.email).to.be.equal(mockUser.email)
            expect(cookie).to.be.equal(cookieSecret)
        })
    })
  
    describe('POST /api/sessions/login', () => {
        it('Redirecciona a /api/products', async () => {
            const mockUser = {
                email: 'test@testing.com',
                password: '123456789'
            }
  
            const {body, headers, status, ok} = await requester
                .post('/api/sessions/login')
                .send(mockUser)
  
            const cookie = headers['set-cookie'][0].split('=')[0]
            const cookieSecret = config.general.COOKIE_SECRET
  
            expect(body).to.be.a('object')
            expect(body.userLogued.email).to.be.equal(mockUser.email)
            expect(body.userLogued).has.property('_id')
            expect(cookie).to.be.equal(cookieSecret)
            expect(status).to.be.equal(200)
            expect(ok).to.be.true
        })
    })
  
    describe('GET /api/sessions/logout', () => {
        let cookie
  
        it('Redirecciona a /api/sessions/login y elimina la cookie', async () => {
            const tokenResponse = await requester
                .post('/api/sessions/login')
                .send({email: 'test@testing.com', password: '123456789'})
        
            cookie = tokenResponse.headers['set-cookie'][0].split(';')[0]
  
            const { headers } = await requester
                .get('/api/sessions/logout')
                .set('Cookie', `${cookie}`)
  
            expect(headers['location']).to.be.equal('/api/sessions/login')
        })
    })
  
    // describe('POST /api/sessions/resetpassword', () => {
    //     it('should send an email to reset the password', async () => {
    //     const { headers } = await requester
    //       .post('/api/sessions/resetpassword')
    //       .send({ email: 'test@testing.com' })
  
    //     expect(headers['content-type']).to.be.equal('text/plain; charset=utf-8')
    //     expect(headers['location']).to.be.equal(
    //       '/api/sessions/forgotpassword?message=recibira%20un%20email%20en%20breves'
    //     )
    //   })
  
    //   it('should return a 500 error if there error to send email', async () => {
    //     const { headers, status } = await requester
    //       .post('/api/sessions/resetpassword')
    //       .send({ email: 'XXXXXXXXXXXXXXXX' })
  
    //     expect(status).to.be.equal(500)
    //     expect(headers['content-type']).to.be.equal('application/json; charset=utf-8')
    //   })
    // })
  
    // describe('POST /api/sessions/createdpassword', () => {
    //     it('should change the password', async () => {
    //         const { headers, request } = await requester
    //             .post('/api/sessions/createdpassword')
    //             .send({ password: '123456789' })
  
    //         expect(headers['location']).to.be.equal('/api/sessions/login?message=contrasena%20creada%20exitosamente')
    //         expect(request._data).to.be.a('object')
    //     })
  
    //     it('should return a 500 error if there error updating password', async () => {
    //     const { headers, status, body } = await requester
    //       .post('/api/sessions/createdpassword')
    //       .send({ password: '123456789' })
  
    //     expect(status).to.be.equal(500)
    //     expect(headers['content-type']).to.be.equal('application/json; charset=utf-8')
    //     expect(body.message).to.be.equal('Error al actualizar la contraseña')
    //   })
    // })
})