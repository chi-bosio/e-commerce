const fs = require('fs');
const express = require('express');
const path = require('path');

const Router = express.Router;
const router = Router();

const HandlebarsManager = require('../managers/handlebarsManager.js');
const hm = new HandlebarsManager()


router.get('/', (req, res) => {
    try {
        const products = hm.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/realtimeproducts', (req, res) => {
    try {
        const products = hm.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;