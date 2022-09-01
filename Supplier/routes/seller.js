const path = require('path');

const express = require('express');
const sellerController = require('../controllers/seller');
const router = express.Router();
router.post('/api/placeorder', sellerController.placeOrder);
router.post('/api/addproduct', sellerController.addProd);
module.exports = router;
