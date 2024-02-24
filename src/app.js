const express=require('express');
const productRouter = require('./routes/productRouter.js');

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productRouter)

app.get('*', (req, res) => {
    res.send('Error 404 - Not Found')
})

app.listen(PORT, () => {
    console.log(`Server Online en puerto ${PORT}`);
});