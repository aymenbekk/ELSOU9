const express = require("express");
const router = express.Router();

const {addCategory, getCategories, deleteParentCategory, deleteChildCategory, getCategoryById} = require('../controller/admin/category')

router.get('/get_categories', getCategories)
router.post('/add_category', addCategory)
router.post('/delete_parent_category', deleteParentCategory) 
router.post('/delete_child_category', deleteChildCategory) 
router.post('/get_category_by_id', getCategoryById)


module.exports = router