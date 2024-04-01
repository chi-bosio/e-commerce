const fs = require('fs');
const express = require('express');
const path = require('path');
const ProductManagerMONGO = require('../dao/productManagerMONGO.js') 

const Router = express.Router;
const router = Router();

const pm = new ProductManagerMONGO()


router.get('/', async (req, res) => {
    try {
        const {docs: products} = await pm.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

// router.get('/realtimeproducts', (req, res) => {
//     try {
//         const products = hm.getProducts();
//         res.render('realTimeProducts', { products });
//     } catch (error) {
//         res.status(500).send('Error interno del servidor');
//     }
// });

module.exports = router;