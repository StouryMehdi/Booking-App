const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "*"
}));
app.use(express.json());

// Path to JSON file
const bookingsFilePath = path.join(__dirname, "data", "bookings.json");

// Initialize data file
const initializeData = async () => {
  try {
    await fs.mkdir(path.dirname(bookingsFilePath), { recursive: true });
    try {
      await fs.access(bookingsFilePath);
    } catch {
      await fs.writeFile(bookingsFilePath, "[]");
    }
  } catch (err) {
    console.error("Initialization error:", err);
  }
};

// Helper functions
const readBookings = async () => {
  try {
    const data = await fs.readFile(bookingsFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading bookings:", err);
    throw err;
  }
};

const writeBookings = async (bookings) => {
  try {
    await fs.writeFile(bookingsFilePath, JSON.stringify(bookings, null, 2));
  } catch (err) {
    console.error("Error writing bookings:", err);
    throw err;
  }
};

// Validation middleware
const validateBooking = (req, res, next) => {
  const { name, date, time, guests } = req.body;
  
  if (!name || !date || !time || !guests) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const guestsNumber = Number(guests);
  if (isNaN(guestsNumber) || guestsNumber < 1) {
    return res.status(400).json({ error: "Invalid guests number" });
  }

  next();
};

// Routes
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await readBookings();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.post("/api/bookings", validateBooking, async (req, res) => {
  try {
    const { name, date, time, guests } = req.body;
    const bookings = await readBookings();
    
    const newBooking = {
      id: uuidv4(),
      name,
      date,
      time,
      guests: Number(guests)
    };

    bookings.push(newBooking);
    await writeBookings(bookings);

    res.status(201).json({
      message: "Booking created",
      booking: newBooking
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

app.put("/api/bookings/:id", validateBooking, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, time, guests } = req.body;
    const bookings = await readBookings();
    
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const updatedBooking = {
      ...bookings[index],
      name,
      date,
      time,
      guests: Number(guests)
    };

    bookings[index] = updatedBooking;
    await writeBookings(bookings);

    res.json({
      message: "Booking updated",
      booking: updatedBooking
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update booking" });
  }
});

app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await readBookings();
    
    const filtered = bookings.filter(b => b.id !== id);
    if (filtered.length === bookings.length) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await writeBookings(filtered);
    res.json({ message: "Booking removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});