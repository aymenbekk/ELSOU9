const express = require("express");
const router = express.Router();

const {addItemToCart, getCartItems, updateItemCart, deleteItemCart} = require('../controller/user/cart')


router.post('/add_item_cart', addItemToCart)
router.post('/get_cart_items', getCartItems)
router.post('/update_item_cart', updateItemCart)  
router.post('/delete_item_cart', deleteItemCart) 

module.exports = router