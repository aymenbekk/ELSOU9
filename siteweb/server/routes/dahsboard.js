const express = require('express')
const router = express.Router()
const { dashboardStatistics } = require('../controller/admin/dashboard')

router.get('/dashboard_statistics', dashboardStatistics)

module.exports = router