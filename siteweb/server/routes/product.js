const express = require("express");
const router = express.Router();

const {addProduct, getAllProducts, getProductDetails, deleteProduct, getProductsByCategory,
        getNewestProducts, addReview, updateProductVisibile, getTopProducts, updateProduct } = require('../controller/user/product')

router.get('/get_all_products', getAllProducts)
router.post('/add_product', addProduct)
router.post('/get_product_details/:id', getProductDetails) 
router.post('/get_products_by_category/:id', getProductsByCategory)
router.get('/get_newest_products', getNewestProducts)  
router.post('/delete_product', deleteProduct) 
router.post('/add_review', addReview)
router.post('/update_product_visible', updateProductVisibile)
router.get('/get_top_products', getTopProducts)
router.post('/update_product', updateProduct)


module.exports = router