const {User, validate} = require('../../models/User')
const EmailToken = require('../../models/EmailToken')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const shortid = require('shortid')
const sendEmail = require('../common/sendEmail')
const crypto = require('crypto')


const generateJwtToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWTSECRET, {
      expiresIn: process.env.TIME,
    });
  };

exports.signup = (req, res) => {

    try {

        const { error } = validate(req.body);
		if (error) return res.status(400).send({ error: error.details[0].message });

        User.findOne({email: req.body.email})
        .then((user) => {
            if (user) return res.status(400).json({error: "User already registred"})
        })

        User.estimatedDocumentCount(async (err, count) => {
            if (err) return res.status(400).json({err})
            let role = 'user'
            if (count === 0) {
                //First user ==> Admin
                role = 'admin'
            } 

                const {firstName, lastName, email, password, telephone} = req.body
                const hash_password = await bcrypt.hash(password, 10)
                const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    hash_password,
                    role,
                    telephone,
                    picture: '/profile.png'
                })

                const user = await newUser.save();

                if (user) {

                    const emailToken = await new EmailToken({
                        userId: user._id,
                        token: crypto.randomBytes(32).toString("hex"),
                    }).save();

                    const url = `${process.env.BASE_URL}/auth/${user.id}/verify/${emailToken.token}`;
		            await sendEmail(user.email, "Verify Email", url);

                    res.status(201).send({message: "An Email sent to your account, Verify"})

                }

                {/* 

                newUser.save((err, user) => {
                    
                    if (err) return res.status(400).json({error: "Something went wrong"})
                    if (user) {
                        const token  = generateJwtToken(user._id)
                        const {_id, firstName, lastName, email, role} = user
                        return res.status(200).json({
                            token,
                            user: {_id, firstName, lastName, email, role}
                        })

                    }

                })
                */}
        }
      );
    } catch (err) {
		console.log(err);
		res.status(500).send({ error: "Internal Server Error" });
	}

   
        
}

exports.signin =  (req, res) => {
    User.findOne({email: req.body.email})
        .exec(async (err, user) => {
            if (err) return res.status(400).json({err})
            if (user) {

                const isPassword = await bcrypt.compare(req.body.password, user.hash_password)

                if (isPassword) {

                    console.log('1')

                    if (!user.verified) {

                        console.log('2')

                        let emailToken = await EmailToken.findOne({ userId: user._id });

			            if (!emailToken) {
                            console.log('3')
				            emailToken = await new EmailToken({
					                    userId: user._id,
					                    token: crypto.randomBytes(32).toString("hex"),
				            }).save();

				        const url = `${process.env.BASE_URL}/auth/${user.id}/verify/${emailToken.token}`;
				        await sendEmail(user.email, "Verify Email", url);

                            
			            }

                        console.log('4')

                        return res.status(201).send({ message: "An Email sent to your account please verify" });
                    }

                    console.log('5')
                    
                    // =======> Clean User (Authorized)
                    const token  = generateJwtToken(user._id)
                    const {_id, firstName, lastName, email, role} = user
                    return res.status(200).json({
                        token,
                        user: {_id, firstName, lastName, email, role}
                    })

                } else return res.status(400).json({error: "Incorrect Password"})
            } else {
                return res.status(400).json({error: "Invalide Email or Password"})
            }
        })
}

exports.checkUser = (req, res) => {

    const token = req.body.token
        if (token) {

            const userId = jwt.verify(token, process.env.JWTSECRET);
            User.findById(userId)
                .then((user) => {
                    return res.status(200).json({user: user})
                })
                .catch((err) => {
                    return res.status(400).json({err})
                })
            
        } else return res.status(400).json('No token')

}

exports.verifyEmailToken = async (req,res) => {

    console.log(req.params)

    try {


		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ error: "Invalid link" });


		const emailToken = await EmailToken.findOne({
			userId: user._id,
			token: req.params.token,
		});

		if (!emailToken) return res.status(400).send({ error: "Invalid link" });

		await User.findByIdAndUpdate(user._id, {verified: true });
     
		await emailToken.remove();


		res.status(200).send({ message: "Email verified successfully" });

	} catch (error) {
		res.status(500).send({ error: "Internal Server Error" });
	}

}

