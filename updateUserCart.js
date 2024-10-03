const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/grocery-store', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');

    const users = await User.find({});
    for (const user of users) {
        let updated = false;
        for (const item of user.cart) {
            if (typeof item.productId === 'number') {
                item.productId = new mongoose.Types.ObjectId(item.productId.toString().padStart(24, '0'));
                updated = true;
            }
        }
        if (updated) {
            await user.save();
            console.log(`Updated user ${user.username}`);
        }
    }

    console.log('Update complete');
    mongoose.disconnect();
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
