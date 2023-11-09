
const { User } = require("../../models/User");
const EmailToken = require("../../models/EmailToken");
const crypto = require("crypto");
const sendEmail = require("../common/sendEmail");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");


exports.sendPasswordLink = async (req, res) => {
	console.log(req.body)
	try {
		const emailSchema = Joi.object({
			email: Joi.string().email().required().label("Email"),
		});
		const { error } = emailSchema.validate(req.body);
		if (error)
			return res.status(400).send({ error: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(400).send({ error: "User with given email does not exist!" });

		let token = await EmailToken.findOne({ userId: user._id });
		if (!token) {
			token = await new EmailToken({
				userId: user._id,
				token: crypto.randomBytes(32).toString("hex"),
			}).save();
		}

		const url = `${process.env.BASE_URL}/password/${user._id}/${token.token}/`;
		await sendEmail(user.email, "Password Reset", url);

		res.status(200).send({ message: "Password reset link sent to your email account" });
	} catch (error) {
		res.status(500).send({ error: "Internal Server Error" });
	}
};

// verify password reset link
exports.verifyPasswordLink =  async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await EmailToken.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		res.status(200).send("Valid Url");
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
};

//  set new password
exports.setNewPassword =  async (req, res) => {
	try {
		const passwordSchema = Joi.object({
			password: passwordComplexity().required().label("Password"),
		});
		const { error } = passwordSchema.validate(req.body);
		if (error)
			return res.status(400).send({ error: error.details[0].message });

		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ error: "Invalid link" });

		const token = await EmailToken.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ error: "Invalid link" });

		if (!user.verified) user.verified = true;

		
		const hashPassword = await bcrypt.hash(req.body.password, 10);

		user.hash_password = hashPassword;
		await user.save();
		await token.remove();

		res.status(200).send({ message: "Password reset successfully" });
	} catch (error) {
		res.status(500).send({ error: "Internal Server Error" });
	}
};
