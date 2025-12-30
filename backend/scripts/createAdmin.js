/**
 * Admin User Creation Script
 * 
 * This script creates an admin user in the database.
 * Run with: node scripts/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = 'admin@userhub.com';
const ADMIN_PASSWORD = 'Admin@123!';
const ADMIN_NAME = 'System Administrator';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastLogin: { type: Date, default: null }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
        if (existingAdmin) {
            console.log('✓ Admin user already exists');
            console.log(`  Email: ${ADMIN_EMAIL}`);
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

        // Create admin
        const admin = await User.create({
            email: ADMIN_EMAIL,
            password: hashedPassword,
            fullName: ADMIN_NAME,
            role: 'admin',
            status: 'active'
        });

        console.log('✓ Admin user created successfully!');
        console.log('\n--- Admin Credentials ---');
        console.log(`Email: ${ADMIN_EMAIL}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);
        console.log('-------------------------\n');

        process.exit(0);
    } catch (error) {
        console.error('✗ Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
