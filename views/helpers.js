module.exports = {
	// a helper function to check if an error is passed to show it on layout
	getError(errors, prop) {
		// prop === 'email' || 'password' || 'passwordConfirmation'
		try {
			// return the error msg according to the prop where the error happened
			return errors.mapped()[prop].msg;
		} catch (err) {
			// if error does not exist(undefined)
			// means the user made all the inputs correct and return empty string
			return '';
		}
	}
};
