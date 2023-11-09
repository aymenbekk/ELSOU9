
const mongoose = require("mongoose");
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const UserSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, 'Please enter the first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please enter the last name']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    }, 
    hash_password: {
        type: String, 
        minlength: [6, 'Minimum password length must be 6 characters']
    },
    googleId: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    telephone: {
        type: String,

    },
    picture: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model("user", UserSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = { User, validate };