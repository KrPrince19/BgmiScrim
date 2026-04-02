const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bgmiscrim');
        const users = await User.find({}, 'username email role');
        console.log(`\nTOTAL USERS IN DB: ${users.length}`);
        users.forEach((u, index) => {
            console.log(`[${index + 1}] Username: ${u.username} | Role: ${u.role} | Email: ${u.email}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
