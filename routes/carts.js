const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

// POST req to add an item to a cart
router.post('/cart/products', async (req, res) => {
	// declare the cart var here to use it in this scope
	let cart;
	// check if a cart already exist or not !
	if (!req.session.cartId) {
		// creat a cart and store an empty items array in it
		cart = await cartsRepo.create({ items: [] });
		// attach it to the user cookie and creat cartId prop to it
		req.session.cartId = cart.id;
	} else {
		// get the cart from the repository
		cart = await cartsRepo.getOne(req.session.cartId);
	}
	// find if the item already exists in the cart
	const existingItem = cart.items.find((item) => item.id === req.body.productId);
	if (existingItem) {
		// increment quantity and save cart
		existingItem.quantity++;
		res.redirect('/');
	} else {
		//add new product id to items array
		cart.items.push({ id: req.body.productId, quantity: 1 });
		res.redirect('/');
	}

	// update the cart repo with the new entry
	await cartsRepo.update(cart.id, {
		items: cart.items
	});
});

// GET req to show all items in cart
router.get('/cart', async (req, res) => {
	// check if a cart already exist or not !
	if (!req.session.cartId) {
		res.redirect('/');
	}

	const cart = await cartsRepo.getOne(req.session.cartId);

	for (let item of cart.items) {
		const product = await productsRepo.getOne(item.id);
		// add product data to the item obj
		item.product = product;
	}

	res.send(cartShowTemplate({ items: cart.items }));
});

// POST req to delete an item from a cart
router.post('/cart/product/delete', async (req, res) => {
	const { itemId } = req.body;
	const cart = await cartsRepo.getOne(req.session.cartId);

	// remove the matched item from the array
	const items = cart.items.filter((item) => {
		return item.id !== itemId;
	});

	// update cart
	await cartsRepo.update(req.session.cartId, { items });

	res.redirect('/cart');
});
module.exports = router;
