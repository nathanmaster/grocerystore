class GroceryStore {
    constructor(db) {
        this.db = db;
    }

    async addProduct(name, price, weight) {
        return await this.db.addProduct(name, price, weight);
    }

    async getProducts() {
        return await this.db.getProducts();
    }

    async getProductById(id) {
        return await this.db.getProductById(id);
    }

    async updateProduct(id, updatedData) {
        return await this.db.updateProduct(id, updatedData);
    }

    async deleteProduct(id) {
        return await this.db.deleteProduct(id);
    }

    async addToCart(userId, productId) {
        return await this.db.addToCart(userId, productId);
    }

    async getCartItems(userId) {
        return await this.db.getCartItems(userId);
    }

    async removeFromCart(userId, productId) {
        return await this.db.removeFromCart(userId, productId);
    }

    async addUser(username, password) {
        return await this.db.addUser(username, password);
    }

    async findUserByUsername(username) {
        return await this.db.findUserByUsername(username);
    }

    async findUserById(id) {
        return await this.db.findUserById(id);
    }
}

module.exports = GroceryStore;
