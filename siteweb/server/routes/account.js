const express = require('express')
const router = express.Router()

const { editFirstLastName, editPassword, editProfilePicture } = require('../controller/user/account')

router.post('/edit_first_last_name', editFirstLastName)
router.post('/edit_password', editPassword)
router.post('/edit_profile_picture', editProfilePicture)

module.exports = router

