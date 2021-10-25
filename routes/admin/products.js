// external libs
const express = require('express');
const multer = require('multer');

// written libs
const productsRepo = require('../../repositories/products');
const newProductsTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');
const { requireTitle, requirePrice, requireImage } = require('./validators');
const { handleErrors, requireAuth } = require('./middlewares');

const router = express.Router();
// direct multer where to save the uploaded files
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', requireAuth, async (req, res) => {
	const products = await productsRepo.getAll();
	res.send(productsIndexTemplate({ products }));
});

router.get('/admin/products/new', requireAuth, (req, res) => {
	res.send(newProductsTemplate({}));
});

router.post(
	'/admin/products/new',
	requireAuth,
	// use multer to parse the file upload
	upload.single('image'),
	// validators
	requireTitle,
	requirePrice,
	requireImage,
	// middleware
	handleErrors(newProductsTemplate),
	// cb function
	async (req, res) => {
		// save the image as a string
		const image = req.file.buffer.toString('base64');
		const { title, price } = req.body;
		await productsRepo.create({ title, price, image });

		res.redirect('/admin/products');
	}
);

router.get('/admin/products/:id/edit', async (req, res) => {
	const product = await productsRepo.getOne(req.params.id);
	if (!product) {
		return res.send('This product does not exist');
	}

	res.send(productsEditTemplate({ product }));
});

router.post(
	'/admin/products/:id/edit',
	requireAuth,
	// use multer to parse the file upload
	upload.single('image'),
	// validators
	requireTitle,
	requirePrice,
	// middleware
	handleErrors(productsEditTemplate, async (req) => {
		const product = await productsRepo.getOne(req.params.id);
		return { product };
	}),
	// cb function
	async (req, res) => {
		const changes = req.body;
		// if the user updated the image
		if (req.file) {
			// encode the image data to base64 string and save it
			changes.image = req.file.buffer.toString('base64');
		}
		try {
			await productsRepo.update(req.params.id, changes);
		} catch (err) {
			return res.send('The item could not be found!');
		}

		res.redirect('/admin/products');
	}
);

router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
	await productsRepo.delete(req.params.id);

	res.redirect('/admin/products');
});

module.exports = router;
