const express = require('express');
const router = express.Router();

const { makePayment } = require('../controllers/stripepayment');
const { getUserById } = require('../controllers/user');

router.post('/stripepayment', makePayment);

module.exports = router;
