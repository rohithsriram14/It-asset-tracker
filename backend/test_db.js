const mongoose = require('mongoose');
require('dotenv').config();

console.log('MONGO_URI:', process.env.MONGO_URI);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
        process.exit(0);
    } catch (error) {
        console.error('Connection Error:', error.message);
        process.exit(1);
    }
};

connectDB();