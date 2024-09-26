const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises; // Use promises for cleaner async/await syntax
const path = require('path');
const cors = require('cors'); // Import cors
const { v4: uuidv4 } = require('uuid'); // Import UUID

const app = express();
const port = 5000;
const bookingsFilePath = path.join(__dirname, 'data', 'bookings.json');

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Fetch reservations
app.get('/api/bookings', async (req, res) => {
  try {
    const data = await fs.readFile(bookingsFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    return res.status(500).send('Error reading bookings file');
  }
});

// Add a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const data = await fs.readFile(bookingsFilePath, 'utf8');
    const bookings = JSON.parse(data);

    // Find the next available numeric ID
    const nextId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;

    const newBooking = {
      id: nextId, // Assign the new numeric ID
      uuid: uuidv4(), // Generate a UUID for the booking
      ...req.body, // Spread the rest of the booking details
    };

    bookings.push(newBooking);
    await fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2));
    
    res.status(201).json(newBooking); // Send the newly created booking back
  } catch (err) {
    console.error('Error handling booking:', err);
    res.status(500).send('Error handling booking');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});