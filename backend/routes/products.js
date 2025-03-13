const express = require('express')
const {
    getProducts,
    getProduct
} = require('../controllers/productController')

const router = express.Router()

// GET all products
router.get('/', getProducts)

// GET a single Product
router.get('/:id', getProduct)

module.exports = router