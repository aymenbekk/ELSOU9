const jwt = require('jsonwebtoken')


exports.requireSignin = (req, res, next) => {

    if (req.headers.authorization) {

        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, process.env.JWTSECRET);
        req.user = user
        next()

    } else {
        return res.status(400).json({message: "Authorization required"})
    }
}

exports.isUser = (req, res, next) => {
    if (req.user.role !== "user") {
      return res.status(400).json({ message: "User access denied" });
    }
    next();
  };

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
      
        return res.status(400).json({ message: "Admin access denied" });
    }
    next();
  };  