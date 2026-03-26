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
const envPath = path.join(__dirname, '.env');
const result = dotenv.config({ path: envPath });
console.log('=== ENV LOAD DEBUG ===');
console.log('Env file:', envPath);
console.log('Dotenv result:', result.parsed?.MONGO_URI ? 'LOADED' : 'NOT LOADED');
console.log('MONGO_URI from .env:', result.parsed?.MONGO_URI);
console.log('process.env.MONGO_URI:', process.env.MONGO_URI);
console.log('=======================\n');

const startServer = async () => {
  try {
    await connectDB();

    const app = express();

    // Trust proxy if we are behind a reverse proxy (e.g. Heroku, Bluemix, AWS ELB, Nginx, etc)
    // Required for express-rate-limit to correctly identify clients
    app.set('trust proxy', 1);

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
      max: 1000,
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

    let PORT = parseInt(process.env.PORT, 10) || 5000;

    const startAppServer = (port) => {
      const server = app.listen(port, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`Port ${port} is already in use. Trying port ${port + 1}...`);
          startAppServer(port + 1);
        } else {
          console.error(`Server error: ${err.message}`);
          throw err;
        }
      });

      process.on('unhandledRejection', (err) => {
        console.log(`Error: ${err.message}`);
        server.close(() => process.exit(1));
      });
    };

    startAppServer(PORT);

  } catch (err) {
    console.error('Startup failed:', err.message);
    process.exit(1);
  }
};

startServer();
