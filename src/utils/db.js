const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const bookingsFilePath = path.join(dataDir, 'bookings.json');
const usersFilePath = path.join(dataDir, 'users.json');

const readFile = async (filePath, defaultValue = []) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return defaultValue;
    throw err;
  }
};

const writeFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

const readBookings = async () => readFile(bookingsFilePath);
const writeBookings = async (bookings) => writeFile(bookingsFilePath, bookings);
const readUsers = async () => readFile(usersFilePath);
const writeUsers = async (users) => writeFile(usersFilePath, users);

module.exports = {
  readBookings,
  writeBookings,
  readUsers,
  writeUsers
};