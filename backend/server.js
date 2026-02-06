const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security Headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100,
    message: 'Too many requests from this IP, please try again in 10 minutes'
});
app.use('/api', limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/allocations', require('./routes/allocationRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/auditlogs', require('./routes/auditLogRoutes'));

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware (placeholder for now)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
