const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	requireEmailExists,
	requireValidPassword
} = require('./validators');

// create a router to export to the index file
const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post(
	'/signup',
	// use express-validators
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	// middleware
	handleErrors(signupTemplate),
	async (req, res) => {
		const { email, password } = req.body;

		const user = await usersRepo.create({ email, password });

		// store the id of that user inside the cookie
		req.session.userId = user.id; // added by cookie-session

		res.redirect('/admin/products');
	}
);

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are logged out');
});

router.get('/signin', (req, res) => {
	// an empty obj is passed to to avoid destructuring errors
	res.send(signinTemplate({}));
});

router.post(
	'/signin',
	// use express-validators
	requireEmailExists,
	requireValidPassword,
	// middleware
	handleErrors(signinTemplate),
	async (req, res) => {
		const { email } = req.body;
		const user = await usersRepo.getOneBy({ email });

		req.session.userId = user.id;
		res.redirect('/admin/products');
	}
);

module.exports = router;
