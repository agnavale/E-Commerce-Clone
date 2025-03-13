const mongoose = require('mongoose')
const Product = require('../models/productModel')

// get all products
const getProducts = async (req, res) => {
    const products = await Product.find()
    res.status(200).json(products)
}


// get a single workout
const getProduct = async (req , res) => {
    const {id} = req.params 

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:'No such product'})
    }

    const product = await Product.findById(id)

    if (!product){
        return res.status(404).json({error: 'No such product'})
    }

    res.status(200).json(product)
}

module.exports = {
    getProducts,
    getProduct
}