const express = require("express");
const router = express.Router();

const {sendPasswordLink, verifyPasswordLink, setNewPassword} = require('../controller/common/passwordReset')


router.post('/send_password_link', sendPasswordLink)
router.get('/:id/:token', verifyPasswordLink)
router.post('/:id/:token', setNewPassword)  


module.exports = router