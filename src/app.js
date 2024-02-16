const express = require('express');
const ProductManager = require('./productManager');

const PORT = 8080;
const app = express();

const pm = new ProductManager('./products.json');


app.get('/products', async (req, res) => {
    try {
        let limit = req.query.limit;
        let result = await pm.getProducts(); 
        if (limit && limit > 0) {
            result = result.slice(0, limit);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

app.get('/products/:pid', async (req, res) => {
    let { pid } = req.params;
    pid = Number(pid);

    if (isNaN(pid)) {
        return res.send('El id debe ser del tipo numérico');
    }

    try {
        let product = await pm.getProductById(pid);
        res.json(product);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener el producto' });
    }
});

app.get('*', (req, res) => {
    res.send('Error 404 - Not Found')
})

app.listen(PORT, () => {
    console.log(`Server Online en puerto ${PORT}`);
});