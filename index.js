// require express
const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

// Start up an object instance of express app
const app = express();

// make the data in that folder available to the other files
app.use(express.static('public'));
// use bodyParser as a middleware to parse the req and res before passing it to the callback function
// ex: ["email='x'"] => {email:'x'}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: [ 'dadsjninfsnjnafdh' ]
	})
);

// add routes to the server
app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

const serverPort = 3000;
// activate the port
app.listen(serverPort, () => {
	console.log(`Server started and running on http://127.0.0.1:${serverPort}`);
});
