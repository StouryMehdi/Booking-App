const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;
const bookingsFilePath = path.join(__dirname, 'data', 'bookings.json');

app.use(bodyParser.json());

// Fetch reservations
app.get('/api/bookings', (req, res) => {
  fs.readFile(bookingsFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading bookings file');
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/bookings', (req, res) => {
  fs.readFile(bookingsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading bookings file:', err);
      return res.status(500).send('Error reading bookings file');
    }

    const bookings = JSON.parse(data);
    bookings.push(req.body);

    fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2), (err) => {
      if (err) {
        console.error('Error writing to bookings file:', err);
        return res.status(500).send('Error writing to bookings file');
      }
      res.status(201).send('Booking added');
    });
  });
});