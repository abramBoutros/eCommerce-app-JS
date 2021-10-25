const express = require('express');
const cartsRepo = require('../repositories/carts');

const router = express.Router();

// receive a post req to add an item to a cart
router.post('/cart/products', async (req, res) => {
	// declare the cart var here to use it in this scope
	let cart;
	// check if a cart already exist !
	if (!req.session.cartId) {
		// creat a cart and store an empty items array in it
		cart = await cartsRepo.create({ items: [] });
		// attach it to the user cookie
		req.session.cartId = cart.id;
	} else {
		// get the cart from the repository
		cart = await cartsRepo.getOne(req.session.cartId);
	}
	// either increment the quantity of existing product
	// or add new product ti items array
	res.send(cart);
});

// receive a post req to delete an item from a cart

// receive a get req to show all items in cart

module.exports = router;
