const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const AuthRoute = require('./routes/auth')
const UserRoute = require('./routes/user')
const ProductRoute = require('./routes/product')
const CartRoute = require('./routes/cart')
const OrderRoute = require('./routes/order')
const CheckoutRoute = require('./routes/stripe')
dotenv.config()
mongoose
.connect(process.env.MONGO_URL)
.then(() => {console.log('db connected')})
.catch((err) => {console.log(err)})

const app = express()

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });

app.use(express.json())
app.use("/api/auth",AuthRoute)
app.use("/api/users",UserRoute)
app.use("/api/products",ProductRoute)
app.use("/api/carts",CartRoute)
app.use("/api/orders",OrderRoute)
app.use("/api/checkout",CheckoutRoute)
// app.use("/api/logout",AuthRoute)


app.listen(process.env.PORT||5000, () =>{
    console.log('listening on port')
})