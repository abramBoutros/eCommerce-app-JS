const { body } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
	// use express-validators sanitize then validate
	requireEmail: body('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('must be a valid E-mail')
		.custom(async (email) => {
			const exitingUser = await usersRepo.getOneBy({ email });
			if (exitingUser) {
				throw new Error('Email already in use');
			}
		}),
	requirePassword: body('password')
		.trim()
		.isLength({ min: 6, max: 20 })
		.withMessage('Password must be between 6 and 20 characters'),
	requirePasswordConfirmation: body('passwordConfirmation')
		// sanitize then check if confirmation is equal to password
		.trim()
		.isLength({ min: 6, max: 20 })
		.withMessage('Password must be between 6 and 20 characters')
		.custom((passwordConfirmation, { req }) => {
			if (passwordConfirmation !== req.body.password) {
				throw new Error('The password and the password confirmation does not match');
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
	requireEmailExists: body('email')
		//
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('must be a valid E-mail')
		.custom(async (email) => {
			const user = await usersRepo.getOneBy({ email });
			if (!user) {
				throw new Error('Email not found');
			}
		}),
	requireValidPassword: body('password')
		//
		.trim()
		.custom(async (password, { req }) => {
			const user = await usersRepo.getOneBy({ email: req.body.email });
			if (!user) {
				throw new Error('Invalid password');
			}
			const validPass = await usersRepo.comparePasswords(user.password, password);
			if (!validPass) {
				throw new Error('Invalid password');
			}
		}),
	requireTitle: body('title')
		//
		.trim()
		.isLength({ min: 4, max: 40 })
		.withMessage('Title must be between 4 and 40 characters'),
	requirePrice: body('price')
		.trim()
		.toFloat() // from sting to a float
		.isFloat({ min: 1 }) // the value is at least 1
		.withMessage('Price must be a number greater than 1'),
	requireImage: body('image').custom((image, { req }) => {
		const file = req.file;
		if (!file) {
			throw new Error('Please upload file');
		}
		return (req, res, next) => {
			next();
		};
	})
};
