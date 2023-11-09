const express = require("express");
const router = express.Router();

const {generateIntentPayment, confirmPayment} = require('../controller/user/stripe')


router.post('/', generateIntentPayment)
router.post('/confirm-payment', confirmPayment) 
 


module.exports = router