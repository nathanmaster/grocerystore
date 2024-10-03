const Product = require('./models/Product');
const User = require('./models/User');
const mongoose = require('mongoose');

class GroceryStore {
    async addProduct(name, price, weight) {
        const product = new Product({ name, price, weight });
        await product.save();
        return product;
    }

    async getProducts() {
        return await Product.find({});
    }

    async getProductById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid product ID');
        }
        const product = await Product.findById(id);
        if(!product) {
            throw new Error('Product not found');
        }

        return product;
    }

    async updateProduct(id, updatedData) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid product ID');
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        if(!updatedProduct) {
            throw new Error('Product not found');
        }
        return updatedProduct;
    }

    async deleteProduct(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid product ID');
        }
        const deletedProduct = await Product.findByIdAndDelete(id);
        if(!deletedProduct) {
            throw new Error('Product not found');
        }

        return deletedProduct;
    }

    async addToCart(userId, productId) {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            user.cart.push({ productId: new mongoose.Types.ObjectId(productId), quantity: 1 });
        }
        await user.save();
    }

    async getCartItems(userId) {
        const user = await User.findById(userId).populate('cart.productId');
        if (!user) throw new Error('User not found');

        user.cart = user.cart.filter(item => item.productId);
        await user.save;


        return user.cart.map(item => ({
            product: item.productId,
            quantity: item.quantity
        }));
    }

    async removeFromCart(userId, productId) {
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        await user.save();
    }
}

module.exports = GroceryStore;
