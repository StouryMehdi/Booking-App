// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;

app.use(express.json());

// Serve the JSON file
app.get('/api/bookings', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'data', 'bookings.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading data' });
    }
    res.json(JSON.parse(data));
  });
});

// Update the JSON file
app.post('/api/bookings', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'data', 'bookings.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading data' });
    }

    const bookings = JSON.parse(data);
    bookings.push(req.body);

    fs.writeFile(filePath, JSON.stringify(bookings, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving data' });
      }
      res.status(201).json(req.body);
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});