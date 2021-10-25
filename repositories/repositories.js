const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
	// build the constructor function with a filename argument to store data
	constructor(filename) {
		// check if there is a filename passed
		if (!filename) {
			throw new Error('Creating a repository requires a filename');
		}
		// store the filename to instance variable
		this.filename = filename;
		// check if that file exist using accessSync once
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			// if it does not exist create that file
			// the sync version is used here cuz it's only gonna be used only once = won't affect performance
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async create(attrs) {
		// add an id to the attrs
		attrs.id = this.randomId();
		// get all the records
		const records = await this.getAll();
		// add in the new record with the id attached to it
		records.push(attrs);
		// write back the updated data to the hard drive
		await this.writeAll(records);
		// return the attrs with the id prop in it
		return attrs;
	}

	async getAll() {
		// open the file then read its contents then parse the contents then return the parsed data in an array
		return JSON.parse(await fs.promises.readFile(this.filename, { encoding: 'utf-8' }));
	}

	async writeAll(records) {
		// take the records argument and write it to this.filename
		// 2nd argument is a customized parsing function -> null is passed
		// 3rd argument is the level of the indentation of the json file
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 4));
	}

	randomId() {
		// generate a random id with 4 bytes in sting hexadecimal
		return crypto.randomBytes(4).toString('hex');
	}

	async getOne(id) {
		// get all the records
		const records = await this.getAll();
		// loop over records and return when id matches
		return records.find((record) => record.id === id);
	}

	async delete(id) {
		const records = await this.getAll();
		const filteredRecords = records.filter((record) => record.id !== id);
		await this.writeAll(filteredRecords);
	}

	async update(id, attrs) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);

		if (!record) {
			throw new Error(`records with id of '${id}' is not found`);
		}
		// assign the updated attrs to the record ig it was found
		Object.assign(record, attrs);
		await this.writeAll(records);
	}

	async getOneBy(filters) {
		const records = await this.getAll();

		for (let record of records) {
			let found = true;

			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}
			if (found) {
				return record;
			}
		}
	}
};
