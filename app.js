const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const GroceryStore = require('./GroceryStore');

const app = express();
const store = new GroceryStore();

//test products
store.addProduct('Banana', 0.3, 0.25);
store.addProduct('Carrot', 0.2, 0.1);


//set up views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs' );

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.get('/', (req, res) => {
    res.render('index', { products: store.getProducts()});
});

//read
app.get('/product/:id', (req, res) => {
    const product = store.getProductById(parseInt(req.params.id));
    if (product) {
        res.render('product', { product });
    } else {
        res.status(404).send('product not found');
    };
});

//create
app.post('/product/add', (req, res) => {
    const { name, price, weight } = req.body;
    const product = store.addProduct(name, parseFloat(price), parseFloat(weight));
    res.redirect('/')
    
});

//update 
app.post('/product/update/:id', (req, res) => {
    const {name, price, weight } = req.body;
    const updatedProduct = store.updateProduct(parseInt(req.params.id), { name, price: parseFloat(price), weight: parseFloat(weight) });

    if (updatedProduct) {
        res.redirect('/')

    } else {
        res.status(404).send('Product not found');
    }
})

//delete
app.post('/product/delete/:id', (req, res) => {
    const {name, price, weight } = req.body;
    const deletedProduct = store.deleteProduct(parseInt(req.params.id));

    if (deletedProduct) {
        res.redirect('/')

    } else {
        res.status(404).send('Product not found');
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
