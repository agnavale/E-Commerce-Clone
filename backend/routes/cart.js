const express = require('express')
const { getCart, addToCart, deleteFromCart, updateCart } = require('../controllers/cartController')


const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// require auth for all cart routes
router.use(requireAuth)

// GET all cart items
router.get('/', getCart)

// POST a new item 
router.post('/', addToCart)

// DELETE a cart item
router.delete('/:product_id', deleteFromCart)

// UPDATE a cart item qty
router.patch('/:product_id', updateCart)

module.exports = router