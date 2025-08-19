const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require('../middlewares/auth');

const dataDir = path.join(__dirname, '../data');
const usersFilePath = path.join(dataDir, 'users.json');

const initializeData = async () => {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    
    // Check if users file exists
    try {
      await fs.access(usersFilePath);
      console.log('Users file already exists, skipping initialization');
    } catch {
      // Get admin credentials from environment variables
      const adminEmail = process.env.DEFAULT_ADMIN_EMAIL;
      const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
      
      if (!adminEmail || !adminPassword) {
        throw new Error('Default admin credentials not configured in environment variables');
      }

      const hashedPassword = await hashPassword(adminPassword);
      const defaultUsers = [{
        id: uuidv4(),
        email: adminEmail,
        password: hashedPassword, // Only stored hashed password
        role: 'admin',
        createdAt: new Date().toISOString()
      }];
      
      await fs.writeFile(usersFilePath, JSON.stringify(defaultUsers, null, 2));
      console.log('Default admin user created');
    }
  } catch (err) {
    console.error("Initialization error:", err);
    throw err; // Throw the error to be caught in server.js
  }
};

module.exports = { initializeData };