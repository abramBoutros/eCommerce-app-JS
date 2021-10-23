const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const repository = require('./repositories');

// a version of that function that returns a promise
const scrypt = util.promisify(crypto.scrypt);

// make sure that this class inherit the repository class
class UsersRepository extends repository {
	async create(attrs) {
		// attach random id to every user
		attrs.id = this.randomId();
		// generate salt to add to the password for security
		const salt = crypto.randomBytes(8).toString('hex');
		// generate a hashed password buffer
		const buffed = await scrypt(attrs.password, salt, 64);

		// load the contents from the users file to get the most recent this.filename
		const records = await this.getAll();
		const record = {
			...attrs,
			// overwrite the password with the hashed one
			password: `${buffed.toString('hex')}.${salt}`
		};
		records.push(record);
		// write the updated records array back to this.filename
		await this.writeAll(records);
		// return the user data
		return record;
	}

	// compare database saved password("hash.salt") with the one the user supplied
	async comparePasswords(saved, supplied) {
		// split the full hashed and the salt to be used
		const [ hashed, salt ] = saved.split('.');
		// add the salt to the supplied pass and hash to a buffer then compare
		const hashedSupplied = await scrypt(supplied, salt, 64);
		return hashed === hashedSupplied.toString('hex');
	}
}

// export an instance with the same filename to avoid errors
// only one copy of this file needed for this project
module.exports = new UsersRepository('users.json');
