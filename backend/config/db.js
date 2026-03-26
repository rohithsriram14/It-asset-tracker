const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Safe URI logging (hides password)
        const safeUri = process.env.MONGO_URI 
            ? process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@') 
            : 'UNDEFINED';
        console.log(`Attempting to connect to: ${safeUri}`);

        // Removed deprecated useNewUrlParser and useUnifiedTopology
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        console.warn('Server is starting without a successful database connection.');
    }
};

module.exports = connectDB;
