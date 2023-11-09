const express = require('express')
const router = express.Router()

const { createAttribute, deleteAttribute } = require('../controller/admin/attribute')

router.post('/create_attribute', createAttribute)
router.post('/delete_attribute', deleteAttribute)

module.exports = router
