const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const DummyDB = require('./db/dummyDB'); // Import the singleton DummyDB instance
const GroceryStore = require('./GroceryStore');
require('./config/passport')(passport);

const app = express();
app.use(methodOverride('_method'));

const store = new GroceryStore(DummyDB); // Pass the singleton instance to the GroceryStore class


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Connect to the database
DummyDB.connect().catch(err => {
    console.error('Error connecting to the database:', err);
    process.exit(1);
});

store.addProduct('Apple', parseFloat(.2), parseFloat(.11))

// Routes
app.get('/', async (req, res) => {
    const products = await store.getProducts();
    res.render('index', { products, user: req.user });
});

app.get('/product/:id', async (req, res) => {
    try {
        const product = await store.getProductById(req.params.id);
        if (product) {
            res.render('product', { product, user: req.user });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        res.status(400).send('Invalid product ID');
    }
});

app.post('/product/add', async (req, res) => {
    const { name, price, weight } = req.body;
    await store.addProduct(name, parseFloat(price), parseFloat(weight));
    res.redirect('/');
});

app.post('/product/update/:id', async (req, res) => {
    try {
        const { name, price, weight } = req.body;
        const updatedProduct = await store.updateProduct(req.params.id, { name, price: parseFloat(price), weight: parseFloat(weight) });
        if (updatedProduct) {
            res.redirect('/');
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        res.status(400).send('Invalid product ID');
    }
});

app.post('/product/delete/:id', async (req, res) => {
    try {
        const deletedProduct = await store.deleteProduct(req.params.id);
        if (deletedProduct) {
            res.redirect('/');
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        res.status(400).send('Invalid product ID');
    }
});

// Admin dashboard view
app.get('/admin', async (req, res) => {
    const products = await store.getProducts();
    res.render('admin', { products, user: req.user });
});

// Admin add product view
app.get('/admin/product/add', (req, res) => {
    res.render('addProduct', { user: req.user });
});

// Admin add product
app.post('/admin/product/add', async (req, res) => {
    const { name, price, weight } = req.body;
    await store.addProduct(name, parseFloat(price), parseFloat(weight));
    res.redirect('/admin');
});

// Admin update product view
app.get('/admin/product/update/:id', async (req, res) => {
    const product = await store.getProductById(req.params.id);
    if (product) {
        res.render('updateProduct', { product, user: req.user });
    } else {
        res.status(404).send('Product not found');
    }
});

// Admin update product
app.post('/admin/product/update/:id', async (req, res) => {
    const { name, price, weight } = req.body;
    const updatedProduct = await store.updateProduct(req.params.id, { name, price: parseFloat(price), weight: parseFloat(weight) });
    res.redirect('/admin');
});

// Admin delete product
app.post('/admin/product/delete/:id', async (req, res) => {
    await store.deleteProduct(req.params.id);
    res.redirect('/admin');
});

// Register view
app.get('/register', (req, res) => {
    res.render('register');
});

// User save
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        await store.addUser(username, password); // Use GroceryStore method
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

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
        await store.removeFromCart(req.user.id, productId); // Use the new method
        res.redirect('/cart');
    } catch (err) {
        console.error('Error removing from cart:', err);
        res.status(500).send('Error removing from cart');
    }
});

// Server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
