const express = require("express");
const router = express.Router();

const {addOrder, getOrders, getOrder, editOrder, getUserOrders} = require('../controller/user/order')


router.post('/add_order', addOrder)
router.get('/get_orders', getOrders)
router.post('/get_order/:id', getOrder)
router.post('/edit_order', editOrder)
router.post('/get_user_orders', getUserOrders)


module.exports = router