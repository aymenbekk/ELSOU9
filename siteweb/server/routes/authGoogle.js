const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const generateJwtToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWTSECRET, {
    expiresIn: process.env.TIME,
  });
};

router.get("/login/success", (req, res) => {
  if (req.user) {
    console.log(req.user);
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(`${process.env.BASE_URL}/`);
});

router.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:4000/auth/google/callback/success",
    failureRedirect: "http://localhost:4000/auth/google/callback/failure",
  })
);

router.get("/callback/success", (req, res) => {
  if (!req.user) {
    req.redirect("/callback/failure");
  } else {
    const _user = req.user._json;

    console.log("___user", _user);

    User.findOne({ email: _user.email }).exec(async (err, user) => {
      if (user) {
        // user already saved in DB

        console.log("existing user", user);

        const token = await generateJwtToken(user._id);
        Object.assign(req.user._json, { token: token });
        Object.assign(req.user._json, { role: user.role });

        if (user.role == "admin")
          return res.redirect(`${process.env.BASE_URL}/dashboard`);
        else return res.redirect(`${process.env.BASE_URL}/home`);
      } else {
        // new user authenticated with google ==> save in DB

        const { given_name, family_name, email, picture } = _user;

        const newUser = new User({
          firstName: given_name,
          lastName: family_name,
          email: email,
          role: "user",
          picture: picture,
          verified: true,
        });

        newUser.save(async (err, user) => {
          if (err) return res.status(400).json({ err });
          if (user) {
            console.log(user);

            const token = await generateJwtToken(user._id);
            Object.assign(req.user._json, { token: token });

            if (user.role == "admin")
              return res.redirect(`${process.env.BASE_URL}/dashboard`);
            else return res.redirect(`${process.env.BASE_URL}/home`);
          }
        });
      }
    });
  }
});

router.get("/callback/failure", (req, res) => {
  res.status(200).json({ error: "Error!!" });
  console.log("errooorr");
});

module.exports = router;
