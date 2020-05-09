const express = require('express');
const router = new express.Router();
const product = require('../controller/productController.js');

router.route('/product').get(product.get);
router.route('/product/:id').get(product.get);

module.exports = router;