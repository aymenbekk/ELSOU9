const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser((user , done) => {
    done(null , user);
})
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: "http://localhost:4000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {  

    return cb(null, profile)
  }
));

passport.use(new FacebookStrategy({
  clientID: process.env.FBCLIENTID,
  clientSecret: process.env.FBCLIENTSECRET,
  callbackURL: "http://localhost:4000/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, cb) {
  return cb(null, profile)
}
));