const express = require('express')
const upload = require('../config/multerConfig')
const {
    getProducts,
    getProduct,
    addProduct,
    imageSearch,
    textSearch
} = require('../controllers/productController')

const router = express.Router()

// GET all products
// router.get('/', getProducts)

// ai image search
router.post('/imageSearch/', upload.single('file'), imageSearch)

// ai text search
router.get('/textSearch/', textSearch)

// GET a single Product
router.get('/:id', getProduct)

// POST a new Product
router.post('/',upload.single('file'), addProduct)

module.exports = router