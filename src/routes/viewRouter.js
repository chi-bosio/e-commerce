const fs = require('fs');
const express = require('express');
const path = require('path');
const ProductManagerMONGO = require('../dao/productManagerMONGO.js') 
const productModel = require('../dao/models/productModel.js')
const cartModel = require('../dao/models/cartModel.js')

const Router = express.Router;
const router = Router();

const pm = new ProductManagerMONGO()

function handleRealTimeProductsSocket(io) {
    io.on("connection", async (socket) => {
      console.log("Usuario conectado a la WebSocket");
      const products = await pm.getProduct();
      socket.emit("products", products);
    });
}  

router.get("/", async (req, res) => {
    res.status(200).render("home");
});

router.get("/products", async (req, res) => {
    let page = req.query.page;
    if (!page) {
        page = 1;
    }

    let {
        docs: product,
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
    } = await productModel.paginate(
        {},
        { limit: 10, page: page, lean: true }
    );

    res.status(200).render("product", {
        product,
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
    });
});

router.get("/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productModel.findById(pid).lean();

        if (!product) {
            return res.status(404).send("El producto no fue encontrado.");
        }

        res.render("productView", { product });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al procesar la solicitud.");
    }
});

router.get("/cart/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartModel
            .findById(cid)
            .populate("product")
            .lean();

        if (!cart) {
            return res.status(404).send("El carrito no fue encontrado.");
        }
        const productsWithDetails = await Promise.all(
            cart.products.map(async (product) => {
                const productDetails = await productModel
                    .findById(product.pid)
                    .lean();

                return {
                    ...product,
                    title: productDetails.title,
                    price: productDetails.price,
                };
            })
        );

        res.render("cart", { cart: { ...cart, products: productsWithDetails } });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al procesar la solicitud.");
    }
});

router.get("/realtimeproducts", async (req, res) => {
    const products = await pm.getProduct();
    res.status(200).render("realtimeproducts", { products });
});

module.exports = {router, handleRealTimeProductsSocket}