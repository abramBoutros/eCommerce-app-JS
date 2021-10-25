const { validationResult } = require('express-validator');

module.exports = {
	handleErrors(templateFunc, dataCb) {
		return async (req, res, next) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				let data = {};
				// to make data callback an optional arg
				if (dataCb) {
					data = await dataCb(req);
				}
				return res.send(templateFunc({ errors, ...data }));
			}

			next(); // call the next middleware or invoke the route handler
		};
	},
	requireAuth(req, res, next) {
		// if the user is not signed in as an admin
		if (!req.session.userId) {
			return res.redirect('/signin');
		}
		// next func is a sign that the function is executed correctly
		next();
	}
};
