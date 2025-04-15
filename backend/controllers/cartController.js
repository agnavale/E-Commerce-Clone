const Cart = require('../models/cartModel')
const mongoose = require('mongoose')

// get all cart items 
const getCart = async (req, res) => {
    const user_id = req.user._id
    
    const cart = await Cart.getCart(user_id)
    res.status(200).json(cart)
}

// add to cart
const addToCart = async (req, res) => {
    const user_id = req.user._id
    const { product_id } = req.body

    if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try{
        const cartItem = await Cart.addToCart(product_id, user_id)
        res.status(200).json(cartItem)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// delete item from cart
const deleteFromCart = async (req, res) => {
    const user_id = req.user._id 
    const { product_id } = req.params 

    if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }
    
    try{
        const cartItem = await Cart.deleteFromCart(product_id, user_id)
        res.status(200).json(cartItem)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// update quatity of item
const updateCart = async (req, res) => {
    const user_id = req.user._id 
    const { product_id } = req.params 
    const { qty } = req.body 

    if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        const cartItem = await Cart.updateCart(product_id, user_id, qty)
        res.status(200).json(cartItem)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    getCart,
    addToCart,
    deleteFromCart,
    updateCart
}