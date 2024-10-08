const DBInterface = require('./dbInterface');

class DummyDB extends DBInterface {
    constructor() {
        super();
        this.products = [];
        this.users = [];
    }

    async connect() {
        console.log('Connected to DummyDB');
    }

    async disconnect() {
        console.log('Disconnected from DummyDB');
    }

    async addProduct(name, price, weight) {
        const product = { id: this.products.length + 1, name, price, weight };
        this.products.push(product);
        return product;
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        return this.products.find(product => product.id === parseInt(id));
    }

    async updateProduct(id, data) {
        const product = this.products.find(product => product.id === parseInt(id));
        if (product) {
            Object.assign(product, data);
            return product;
        }
        return null;
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === parseInt(id));
        if (index !== -1) {
            return this.products.splice(index, 1)[0];
        }
        return null;
    }

    async addToCart(userId, productId) {
        const user = this.users.find(user => user.id === userId);
        if (!user) throw new Error('User not found');

        const cartItem = user.cart.find(item => item.productId === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            user.cart.push({ productId, quantity: 1 });
        }
        console.log('Current User Cart: ', user.cart)
    }

    async getCartItems(userId) {
        const user = this.users.find(user => user.id === userId);
        if (!user) throw new Error('User not found');
    
        console.log('Products:', this.products);
        console.log('User Cart:', user.cart);
    
        return user.cart.map(item => {
            const product = this.products.find(product => product.id === parseInt(item.productId, 10));
            if (!product) {
                console.error(`Product with ID ${item.productId} not found`);
                return null;
            }
            return {
                product: product,
                quantity: item.quantity
            };
        }).filter(item => item !== null);
    }

    async removeFromCart(userId, productId) {
        const user = this.users.find(user => user.id === userId);
        if (!user) throw new Error('User not found');
    
        user.cart = user.cart.filter(item => item.productId !== parseInt(productId, 10));
        console.log(`Updated User Cart: `, user.cart);
    }
    

    async addUser(username, password) {
        const user = { id: this.users.length + 1, username, password, cart: [] };
        this.users.push(user);
        console.log('User added:', user); 
        console.log('Current users:', this.users); 
        return user;
    }

    async findUserByUsername(username) {
        const user = this.users.find(user => user.username === username);
        console.log('Current users:', this.users);
        console.log('Finding user by username:', username, 'Result:', user); 
        return user;
    }

    async findUserById(id) {
        const user = this.users.find(user => user.id === parseInt(id));
        console.log('Finding user by ID:', id, 'Result:', user); 
        return user;
    }
}

module.exports = new DummyDB();
