const mongoose = require('mongoose')
const Product = require('../models/productModel')

// get all products
const getProducts = async (req, res) => {
    const searchQuery = req.query.search

    try {
        const products = await Product.find({
            name: { $regex: searchQuery, $options: "i" },
        })
        return res.json(products);

    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch products" })
    }
}

// get a single product
const getProduct = async (req , res) => {
    const {id} = req.params 
    console.log(id)

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
