const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require('./auth');

const dataDir = path.join(__dirname, '../data');
const usersFilePath = path.join(dataDir, 'users.json');

const initializeData = async () => {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    
    try {
      await fs.access(usersFilePath);
      console.log('Users file exists, skipping initialization');
    } catch {
      const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
      const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@1234';
      
      if (!adminEmail || !adminPassword) {
        throw new Error('Admin credentials not configured in environment variables');
      }

      const hashedPassword = await hashPassword(adminPassword);
      const defaultUsers = [{
        id: uuidv4(),
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      }];
      
      await fs.writeFile(usersFilePath, JSON.stringify(defaultUsers, null, 2));
      console.log('Default admin user created with email:', adminEmail);
    }
  } catch (err) {
    console.error("Initialization error:", err);
    throw err;
  }
};

module.exports = { initializeData };