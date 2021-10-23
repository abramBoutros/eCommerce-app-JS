const repository = require('./repositories');

class ProductsRepository extends repository {}

module.exports = new ProductsRepository('products.json');
