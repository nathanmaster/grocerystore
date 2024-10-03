const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const GroceryStore = require('./GroceryStore');
const User = require('./models/User');
require('./config/passport')(passport);
const app = express();
const store = new GroceryStore();
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

mongoose.connect('mongodb://127.0.0.1:27017/grocery-store', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

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
        const user = new User({ username, password });
        await user.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

// Login view + redirect
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// Logout
app.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

/* Cart endpoint using GroceryStore class instead of direct routes 

// Create cart
app.post('/cart/add/:id', async (req, res) => {
    if (!req.user) {
        console.log('User not logged in');
        return res.redirect('/login');
    }
    const productId = req.params.id;
    try {
        await store.addToCart(req.user._id, productId);
        res.redirect('/');
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).send('Error adding to cart');
    }
});

// Read cart
app.get('/cart', async (req, res) => {
    if (!req.user) {
        console.log('User not logged in');
        return res.redirect('/login');
    }
    try {
        const cartItems = await store.getCartItems(req.user._id);
        res.render('cart', { cartItems });
    } catch (err) {
        console.error('Error fetching cart items:', err);
        res.status(500).send('Error fetching cart items');
    }
});

// Delete cart
app.delete('/cart/remove/:id', async (req, res) => {
    if (!req.user) {
        console.log('User not logged in');
        return res.redirect('/login');
    }
    const productId = req.params.id;
    try {
        await store.removeFromCart(req.user._id, productId);
        res.redirect('/cart');
    } catch (err) {
        console.error('Error removing from cart:', err);
        res.status(500).send('Error removing from cart');
    }
});
*/


    // Direct operational routes
// Create cart
app.post('/cart/add/:id', async (req, res) => {
    if (!req.user) {
        console.log('User not logged in');
        return res.redirect('/login');
    }
    const productId = req.params.id;
    try {
        const user = await User.findById(req.user._id);
        if (!user) throw new Error('User not found');

        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            user.cart.push({ productId: new mongoose.Types.ObjectId(productId), quantity: 1 });
        }
        await user.save();
        res.redirect('/');
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).send('Error adding to cart');
    }
});

// Read cart
app.get('/cart', async (req, res) => {
    if (!req.user) {
        console.log('User not logged in');
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.user._id).populate('cart.productId');
        if (!user) throw new Error('User not found');

        const cartItems = user.cart.map(item => ({
            product: item.productId,
            quantity: item.quantity
        }));
        res.render('cart', { cartItems });
    } catch (err) {
        console.error('Error fetching cart items:', err);
        res.status(500).send('Error fetching cart items');
    }
});

// Delete cart
// Decrease quantity or remove product from cart
app.delete('/cart/remove/:id', async (req, res) => {
    if (!req.user) {
        console.log('User not logged in');
        return res.redirect('/login');
    }
    const productId = req.params.id;
    try {
        const user = await User.findById(req.user._id);
        if (!user) throw new Error('User not found');

        const cartItem = user.cart.find(item => item.productId.toString() === productId);
        if (cartItem) {
            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
            } else {
                user.cart = user.cart.filter(item => item.productId.toString() !== productId);
            }
            await user.save();
        }
        res.redirect('/cart');
    } catch (err) {
        console.error('Error removing from cart:', err);
        res.status(500).send('Error removing from cart');
    }
});



// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
