const Repository = require('./repositories');

class ProductsRepository extends Repository {}

module.exports = new ProductsRepository('products.json');
