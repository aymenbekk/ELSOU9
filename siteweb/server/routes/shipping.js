const express = require("express");
const router = express.Router();

const {addCountry, getShippingPricing, addPriceToCountry} = require('../controller/admin/shipping')


router.post('/add_country', addCountry)
router.post('/get_shipping_pricing', getShippingPricing)
router.post('/add_price_to_country', addPriceToCountry)


module.exports = router