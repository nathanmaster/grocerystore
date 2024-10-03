class GroceryStore{
    constructor() {
        this.products = [];
        this.nextId = 1;
    }

    addProduct(name, price, weight) {
        const product = {
            id: this.nextId++,
            name,
            price,
            weight
        };
        this.products.push(product);
        return product;
    }

    updateProduct(id, updatedProduct) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedProduct };
            return this.products[index]; 
        }
        return null;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            return this.products.splice(index, 1)[0];
        }
        return null;
    }

    
    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }
}

module.exports = GroceryStore;