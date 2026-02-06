const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Asset = require('../models/Asset');
const Allocation = require('../models/Allocation');
const Maintenance = require('../models/Maintenance');
const AuditLog = require('../models/AuditLog');

dotenv.config();
// Note: In real run, usage would be node seed/seed.js and it might need relative path or copying .env.
// For now, assuming .env or .env.example contains the Mongo URI or user will set it. 
// We will rely on default connection if process.env.MONGO_URI is set, else hardcode for local dev or prompt.
// Given strict instructions not to assume, but we need connection.
// We will try to connect using value from .env.example if not present in process env.

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/itassettracker');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    // Clean DB
    await User.deleteMany();
    await Asset.deleteMany();
    await Allocation.deleteMany();
    await Maintenance.deleteMany();
    await AuditLog.deleteMany();

    console.log('Data Destroyed...');

    // Create Users
    const users = await User.create([
        {
            employeeId: 'ADM001',
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            department: 'IT',
            role: 'admin'
        },
        {
            employeeId: 'EMP001',
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            department: 'Sales',
            role: 'user'
        },
        {
            employeeId: 'EMP002',
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123',
            department: 'Marketing',
            role: 'user'
        },
        {
            employeeId: 'EMP003',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            password: 'password123',
            department: 'Engineering',
            role: 'user'
        },
        {
            employeeId: 'EMP004',
            name: 'Sarah Wilson',
            email: 'sarah@example.com',
            password: 'password123',
            department: 'HR',
            role: 'user'
        },
        {
            employeeId: 'EMP005',
            name: 'David Brown',
            email: 'david@example.com',
            password: 'password123',
            department: 'Finance',
            role: 'user'
        }
    ]);

    console.log('Users Created...');

    // Create Assets
    const assetsData = [
        {
            assetId: 'AST-001',
            assetType: 'Laptop',
            brand: 'Dell',
            model: 'XPS 15',
            serialNumber: 'DLXPS15-001',
            purchaseDate: '2023-01-15',
            warrantyExpiryDate: '2026-01-15',
            vendor: 'Dell Inc.',
            cost: 1500,
            department: 'IT',
            status: 'Available',
            notes: 'High performance laptop'
        },
        {
            assetId: 'AST-002',
            assetType: 'Laptop',
            brand: 'Apple',
            model: 'MacBook Pro 16',
            serialNumber: 'MBP16-001',
            purchaseDate: '2023-02-20',
            warrantyExpiryDate: '2026-02-20',
            vendor: 'Apple Store',
            cost: 2500,
            department: 'Engineering',
            status: 'Available'
        },
        {
            assetId: 'AST-003',
            assetType: 'Desktop',
            brand: 'HP',
            model: 'Elitedesk',
            serialNumber: 'HPE-001',
            purchaseDate: '2022-11-10',
            warrantyExpiryDate: '2025-11-10',
            vendor: 'HP Distributors',
            cost: 900,
            department: 'Sales',
            status: 'Available'
        },
        {
            assetId: 'AST-004',
            assetType: 'Printer',
            brand: 'Canon',
            model: 'ImageRunner',
            serialNumber: 'CNIR-001',
            purchaseDate: '2022-05-05',
            warrantyExpiryDate: '2025-05-05',
            vendor: 'Office Depot',
            cost: 3000,
            department: 'HR',
            status: 'Available'
        },
        {
            assetId: 'AST-005',
            assetType: 'Server',
            brand: 'Dell',
            model: 'PowerEdge',
            serialNumber: 'DPE-001',
            purchaseDate: '2021-06-15',
            warrantyExpiryDate: '2023-06-15', // Expired/Expiring
            vendor: 'Dell Inc.',
            cost: 5000,
            department: 'IT',
            status: 'Available'
        }
        // Add more assets later or duplicate logic...
    ];

    // Helper to generate more assets
    for (let i = 6; i <= 15; i++) {
        assetsData.push({
            assetId: `AST-00${i}`,
            assetType: i % 2 === 0 ? 'Laptop' : 'Desktop',
            brand: i % 2 === 0 ? 'Lenovo' : 'Acer',
            model: i % 2 === 0 ? 'ThinkPad' : 'Aspire',
            serialNumber: `SN-${1000 + i}`,
            purchaseDate: '2023-03-01',
            warrantyExpiryDate: '2026-03-01',
            vendor: 'Tech Vendor',
            cost: 800 + (i * 10),
            department: 'General',
            status: 'Available'
        });
    }

    const assets = await Asset.create(assetsData);
    console.log('Assets Created...');

    // Allocations
    // Assign Asset 2 to User 1 (Admin - though logically Admin might allow self assign or strict separation)
    // Let's Assign Asset 2 to Employee 1 (users[1])
    const allocation1 = await Allocation.create({
        assetId: assets[1]._id,
        assignedTo: users[1]._id,
        assignedBy: users[0]._id,
        assignedDate: new Date(),
        status: 'assigned',
        remarks: 'Initial assignment'
    });

    // Update Asset Status
    assets[1].status = 'Assigned';
    assets[1].assignedTo = users[1]._id;
    await assets[1].save();

    // Create Maintenance Record
    // Asset 5 needs maintenance
    const maintenance = await Maintenance.create({
        assetId: assets[4]._id,
        maintenanceDate: new Date(),
        issueDescription: 'Fan noise',
        vendor: 'Dell Support',
        cost: 150,
        status: 'Open'
    });

    assets[4].status = 'Under Maintenance';
    await assets[4].save();

    console.log('Sample Allocations and Maintenance Created...');

    process.exit();
};

seedData();
