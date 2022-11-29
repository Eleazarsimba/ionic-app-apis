const express = require('express');
const router = express.Router();

const {
    makeSale,
    allProducts,
    registerall,
    receipts,
    eachreceipt,
    loginUser,
    regUser
} = require('../controllers/main_controllers');

router.post('/login', loginUser);
router.post('/register', regUser);

router.post('/new_sale', makeSale);
router.post('/register_all', registerall);
router.get('/allproducts', allProducts);
router.get('/receipts', receipts);
router.get('/eachreceipt/:receiptNo', eachreceipt);

module.exports =router;

