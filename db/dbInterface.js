// db/dbInterface.js
class DBInterface {
    async connect() {
        throw new Error('connect method not implemented');
    }

    async disconnect() {
        throw new Error('disconnect method not implemented');
    }

    async addProduct(name, price, weight) {
        throw new Error('addProduct method not implemented');
    }

    async getProducts() {
        throw new Error('getProducts method not implemented');
    }

    async getProductById(id) {
        throw new Error('getProductById method not implemented');
    }

    async updateProduct(id, data) {
        throw new Error('updateProduct method not implemented');
    }

    async deleteProduct(id) {
        throw new Error('deleteProduct method not implemented');
    }

    async addToCart(userId, productId) {
        throw new Error('addToCart method not implemented');
    }

    async getCartItems(userId) {
        throw new Error('getCartItems method not implemented');
    }

    async removeFromCart(userId, productId) {
        throw new Error('removeFromCart method not implemented');
    }

    async addUser(username, password) {
        throw new Error('addUser method not implemented');
    }

    async findUserByUsername(username) {
        throw new Error('findUserByUsername method not implemented');
    }

    async findUserById(id) {
        throw new Error('findUserById method not implemented');
    }
}

module.exports = DBInterface;
