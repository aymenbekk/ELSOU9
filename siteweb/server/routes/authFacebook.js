const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/User')


const generateJwtToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWTSECRET, {
      expiresIn: process.env.TIME,
    });
  };


router.get('/', passport.authenticate('facebook'));

router.get('/callback',
    passport.authenticate('facebook', 
    {   failureRedirect: 'http://localhost:4000/auth/facebook/callback/failure' ,
        sucessRedirect: 'http://localhost:4000/auth/facebook/callback/success'
        }));


router.get('/callback/success', (req,res) => {

    if(!req.user) {
        req.redirect('/callback/failure')
    }
    else {

        console.log(req.user)

        const _user = req.user._json

        User.findOne({email: _user.email})
            .exec((err, user) => {

                if (user) { // user already saved in DB
                    console.log('user already saved in DB')
                    const token  = generateJwtToken(user._id)
                    const {_id, firstName, lastName, email, role} = user
                    return res.status(200).json({
                        token,
                        user: {_id, firstName, lastName, email, role}
                    })
                } else { // new user authenticated with google ==> save in DB

                    const {given_name, family_name, email, picture} = _user
                
                    const newUser = new User({
                        firstName: given_name,
                        lastName: family_name,
                        email: email,
                        role: 'user',
                        picture: picture
                    })

                    newUser.save((err, user) => {
                    
                        if (err) return res.status(400).json({err})
                        if (user) {
                            const token  = generateJwtToken(user._id)
                            const {_id, firstName, lastName, email, role} = user
                            return res.status(200).json({
                                token,
                                user: {_id, firstName, lastName, email, role}
                            })

                        }

                    })

                }
            })


    }
})   

router.get('/callback/failure', (req,res) => {

    res.status(200).json({error: "Error!!"})
    console.log('errooorr')
}) 

module.exports = router

    
