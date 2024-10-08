const LocalStrategy = require('passport-local').Strategy;
const GroceryStore = require('../GroceryStore');
const DummyDB = require('../db/dummyDB'); // Import the singleton DummyDB instance

// Initialize the grocery store with the singleton DummyDB instance
const groceryStore = new GroceryStore(DummyDB);

module.exports = function (passport) {
    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await groceryStore.findUserByUsername(username);
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            // Simulate password comparison (in a real app, use a hashed password)
            const isMatch = user.password === password;
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await groceryStore.findUserById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};
