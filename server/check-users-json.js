const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const User = require('./models/User');

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bgmiscrim');
        const users = await User.find({}, 'username email role');
        const result = {
            total: users.length,
            users: users.map(u => ({ username: u.username, role: u.role, email: u.email }))
        };
        fs.writeFileSync('users.json', JSON.stringify(result, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
