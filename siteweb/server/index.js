const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const config = require("config")
require('dotenv').config()

const passport = require('passport');
const cookieSession = require('cookie-session');
require('./controller/common/passport')



const app = express();

app.use(express.json())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended:false}))   // it was true before stripe
app.use(bodyParser.json())

//stripe
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

//googleAuth
app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		credentials: true,
	})
);

app.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2']
}));  

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => { res.send('Hello from Express!') })

//ROUTES
const authRoutes = require('./routes/auth')
const googleAuthRoutes = require("./routes/authGoogle");
const facebbokAuthRoutes = require('./routes/authFacebook')
const passwordResetRoutes = require('./routes/passwordReset')
const cartRoutes = require('./routes/cart')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const stripeRoutes = require('./routes/stripe')
const shippingRoutes = require('./routes/shipping');
const orderRoutes = require('./routes/order')
const attributeRoutes = require('./routes/attribute')
const accountRoutes = require('./routes/account')
const dashboardRoutes = require('./routes/dahsboard')

app.use('/auth', authRoutes)
app.use('/auth/google', googleAuthRoutes);
app.use('/auth/facebook', facebbokAuthRoutes)
app.use('/password', passwordResetRoutes)
app.use('/cart', cartRoutes)
app.use('/category', categoryRoutes)
app.use('/product', productRoutes)
app.use('/stripe', stripeRoutes)
app.use('/shipping', shippingRoutes)
app.use('/order', orderRoutes)
app.use('/attribute', attributeRoutes)
app.use('/account', accountRoutes)
app.use('/dashboard', dashboardRoutes)




  
// connect to mongoDB and start the server on port 4000
const dbURI = process.env.DBURI
const PORT = process.env.PORT || 4000;

mongoose.connect(dbURI, {
    //socketTimeoutMS: 45000,
    keepAlive: true
  })
    .then((result) => {
        app.listen(process.env.PORT || 4000);
        console.log("Server is running on port %s", PORT);
    })
    .catch((err) => console.log(err));

