class CartDTO{
    constructor(cart){
        this.id = cart._id
        this.products = cart.products.map(p => ({
            pid: product.pid._id,
            title: product.pid.title,
            price: product.pid.price,
            quantity: product.quantity
        }))
    }
}

module.exports = CartDTO