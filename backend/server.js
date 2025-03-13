require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const productRoutes = require('./routes/products.js')
const userRoutes = require('./routes/user.js')
const cartRoutes = require('./routes/cart.js')

// express app
const app = express()

// middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(res.path, req.method)
    next()
})


// Routes
app.use('/api/products', productRoutes)
app.use('/api/user', userRoutes)
app.use('/api/cart', cartRoutes)

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        //listen for request
        app.listen(process.env.PORT, ()=> {
            console.log('connected on port ' + process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })