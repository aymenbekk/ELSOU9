const express = require("express");
const router = express.Router();

const {signin, signup, checkUser, verifyEmailToken} = require('../controller/common/auth')


router.post('/signin', signin)
router.post('/signup', signup)
router.get('/:id/verify/:token/', verifyEmailToken)  //to verify email confirmation
router.post('/check_get_user', checkUser)  // to decode jwt (is authenticated) and get user info


module.exports = router