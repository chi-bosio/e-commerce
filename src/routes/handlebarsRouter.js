const HandlebarsManager = require('../managers/handlebarsManager.js');
const express = require('express')
const path = require('path');
const __dirname = require('../utils.js')

const Router = require('express').Router;
const router = Router();

const hm = new HandlebarsManager(route);

router.get('/', async (req, res) => {
    const filePath = path.join(__dirname, '../data/carts.json');

    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const products = JSON.parse(data);
        res.render('home', { products });
    } catch (error) {
        console.error('Error al leer el archivo JSON de productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await hm.getProducts();
        res.render('realTimeProducts', { products: JSON.parse(products) });
    } catch (error) {
        console.error('Error al obtener los productos en tiempo real:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;