const {User} = require('../../models/User')
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");

exports.editFirstLastName = async (req, res) => {

    try {

        await User.updateOne({_id: req.body.userId}, {firstName: req.body.firstName, lastName: req.body.lastName})
        return res.status(200).json({succes: true})

    } catch (error) {
        return res.status(400).json({error})
    }

}

exports.editPassword = async (req, res) => {

    try {

        console.log(req.body.password)

        const user = await User.findOne({_id: req.body.userId})

        const isPassword = await bcrypt.compare(req.body.oldPassword, user.hash_password)

        if (!isPassword) return res.status(400).json({error: "Incorrect Password"})

        const passwordSchema = Joi.object({
            password: passwordComplexity().required().label("Password"),
        });
        const passObject = {
            password: req.body.password
        }
        const { error } = passwordSchema.validate(passObject)
        if (error) return res.status(400).send({ error: error.details[0].message });

        const hash_password = await bcrypt.hash(req.body.password, 10)

        await User.updateOne({_id: req.body.userId}, {hash_password: hash_password})

        return res.status(200).json({succes: true})
    
    } catch(error) {
        return res.status(400).json({error})
    }

}

exports.editProfilePicture = async (req, res) => {

    try {

        await User.updateOne({_id: req.body.userId}, {picture: req.body.picture})
        return res.status(200).json({succes: true})


    } catch(error) {
        return res.status(400).json({error})
    }


}