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

<<<<<<< Updated upstream
const PORT = process.env.PORT || 3000;
=======
// Login view + redirect
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

// Logout
app.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Cart routes
app.post('/cart/add/:id', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    const productId = req.params.id;
    try {
        await store.addToCart(req.user.id, productId); // Use GroceryStore method
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error adding to cart');
    }
});

app.get('/cart', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    try {
        const cartItems = await store.getCartItems(req.user.id);
        res.render('cart', { cartItems });
    } catch (err) {
        res.status(500).send('Error fetching cart items');
    }
});


app.delete('/cart/remove/:id', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    const productId = req.params.id;
    console.log(`Received DELETE request to remove product ${productId} from cart`);
    try {
        await store.removeFromCart(req.user.id, productId);
        res.redirect('/cart');
    } catch (err) {
        console.error('Error removing from cart:', err);
        res.status(500).send('Error removing from cart');
    }
});

// Server
const PORT = process.env.PORT || 3000
>>>>>>> Stashed changes
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
