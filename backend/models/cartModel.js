const mongoose = require('mongoose')
const Product = require('./productModel')

const cartSchema = mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true})

// get all cart items
cartSchema.statics.getCart = async function (user_id) {
    const cartItems = await this.find({ user_id }).populate('product_id')

    return cartItems.map(item => ({
        _id: item._id,
        user_id: item.user_id,
        qty: item.qty,
        product_id: item.product_id._id, // Keep product ID separately
        name: item.product_id.name,
        price: item.product_id.price,
        stock: item.product_id.stock,
        image: item.product_id.image,
        description: item.product_id.description
    }))
}

// add item to cart
cartSchema.statics.addToCart = async function (product_id, user_id) {
    const product = await Product.findById(product_id);
    if (!product || product.stock < 1) {
        throw new Error('Product out of stock');
    }

    let cartItem = await this.findOne({ product_id, user_id });

    if (cartItem) {
        if (cartItem.qty + 1 > product.stock) {
            throw new Error('Not enough stock');
        }
        cartItem.qty += 1;
        await cartItem.save();
    } else {
        cartItem = new this({ product_id, user_id, qty: 1 });
        await cartItem.save();
    }

    return {
        _id: cartItem._id,
        user_id: cartItem.user_id,
        qty: cartItem.qty,
        product_id: cartItem.product_id, // Keep product_id separately
        name: product.name,
        price: product.price,
        stock: product.stock,
        image: product.image,
        description: product.description
    };
}

// delete item From Cart
cartSchema.statics.deleteFromCart = async function (product_id, user_id) {
    const result = await this.deleteOne({ product_id, user_id });

    if (result.deletedCount === 0) {
        throw new Error('Item not found in cart');
    }

    return result
}

// update quantity
cartSchema.statics.updateCart = async function (product_id, user_id, qty) {
    if (qty < 0) {
        throw new Error('Quantity cannot be negative');
    }

    if (qty === 0) {
        await this.deleteOne({ product_id, user_id });
        return { message: 'Item removed from cart' };
    }
    
    const product = await Product.findById(product_id);
    if (!product || qty > product.stock) {
        throw new Error('Not enough stock');
    }

    const cartItem = await this.findOne({ product_id, user_id });
    if (!cartItem) {
        throw new Error('Item not found in cart');
    }

    cartItem.qty = qty;
    await cartItem.save();

    return cartItem;
}

module.exports = mongoose.model('Cart', cartSchema)