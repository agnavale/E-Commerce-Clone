const mongoose = require('mongoose')
const Product = require('../models/productModel')
const {handleUpload} = require('../config/cloudinaryConfig')

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

// ai text search Products
const textSearch = async (req, res) => {
    const searchQuery = req.query.search;
    if (!searchQuery) {
        return res.status(400).json({ error: "Search query is required" });
    }

    try {
        // Step 1: Get text embedding from FastAPI using fetch
        const response = await fetch(`${process.env.FASTAPI_URI}/embed-text/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: searchQuery }),
        });

        if (!response.ok) {
            throw new Error(`FastAPI request failed with status ${response.status}`);
        }

        const responseData = await response.json();
        const queryEmbedding = responseData.embedding;
        if (!Array.isArray(queryEmbedding)) {
            throw new Error("queryEmbedding is not an array");
        }
        

        // Step 2: Perform vector search using Mongoose aggregation
        const products = await Product.aggregate([
            {
                $addFields: {
                    similarity: {
                        $sum: {
                            $map: {
                                input: { $range: [0, 384] }, 
                                as: "index",
                                in: {
                                    $multiply: [
                                        { $arrayElemAt: ["$text_embedding", "$$index"] }, 
                                        { $arrayElemAt: [queryEmbedding, "$$index"] } 
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            { 
                $match: { similarity: { $gte: 0.1 } } // Only return items with similarity >= 0.5 (adjust if needed)
            },
            { 
                $sort: { similarity: -1 } // Sort from most to least similar
            },
            {
                $limit: 10 // Limit results to 10 items
            }
        ]);
        return res.json(products);
    } catch (error) {
        console.error("Error in text search:", error);
        return res.status(500).json({ error: "Failed to search products" });
    }
};


// ai image search Products
const imageSearch = async (req, res) => {
    try {
           // Get Image Embedding from FastAPI
        const imageFormData = new FormData();
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype }); // Convert buffer to Blob
        imageFormData.append("file", blob, "image.jpg");

        const imageEmbeddingRes = await fetch(`${process.env.FASTAPI_URI}/embed-image/`, {
            method: "POST",
            body: imageFormData,
        });

        if (!imageEmbeddingRes.ok) throw new Error("Failed to get image embedding");
        const imageEmbeddingData = await imageEmbeddingRes.json();
        const queryEmbedding = imageEmbeddingData.embedding;

        // Search for similar products using MongoDB aggregation
        const products = await Product.aggregate([
            {
                $addFields: {
                    similarity: {
                        $sum: {
                            $map: {
                                input: { $range: [0, 512] }, 
                                as: "index",
                                in: {
                                    $multiply: [
                                        { $arrayElemAt: ["$image_embedding", "$$index"] }, 
                                        { $arrayElemAt: [queryEmbedding, "$$index"] } 
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            { 
                $match: { similarity: { $gte: 0.9 } } // Only return items with similarity >= 0.5 (adjust if needed)
            },
            { 
                $sort: { similarity: -1 } // Sort from most to least similar
            },
            {
                $limit: 10 // Limit results to 10 items
            }
        ]);
        res.json(products);

    } catch (error) {
        console.error("Error in image search:", error);
        res.status(500).json({ error: "Server error" });
    }
};



// add a new Product
const addProduct = async (req, res) => { 
    try {
        // Upload image to Cloudinary
        const imageUrl = await handleUpload(req.file.buffer);

        // Get Image Embedding from FastAPI
        const imageFormData = new FormData();
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype }); // Convert buffer to Blob
        imageFormData.append("file", blob, "image.jpg");


        const imageEmbeddingRes = await fetch(`${process.env.FASTAPI_URI}/embed-image/`, {
            method: "POST",
            body: imageFormData,
        });

        if (!imageEmbeddingRes.ok) throw new Error("Failed to get image embedding");
        const imageEmbeddingData = await imageEmbeddingRes.json();
        const imageEmbedding = imageEmbeddingData.embedding;

        // Get Text Embedding from FastAPI
        const textEmbeddingRes = await fetch(`${process.env.FASTAPI_URI}/embed-text/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: req.body.name + " " + req.body.description })
        });

        if (!textEmbeddingRes.ok) throw new Error("Failed to get text embedding");
        const textEmbeddingData = await textEmbeddingRes.json();
        const textEmbedding = textEmbeddingData.embedding;

        // Save product in MongoDB
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: imageUrl,
            stock: req.body.stock,
            text_embedding: textEmbedding, 
            image_embedding: imageEmbedding,  
        });

        await product.save();
        res.status(201).json({ success: true, product });

    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    getProducts,
    getProduct,
    addProduct,
    imageSearch,
    textSearch
}