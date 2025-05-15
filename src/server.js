const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Environment variable validation
if (!process.env.ALLOWED_ORIGIN && process.env.NODE_ENV === 'production') {
  console.error('FATAL ERROR: ALLOWED_ORIGIN is not set in production');
  process.exit(1);
}

// Security middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later"
// });
// app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

// HTTPS redirection in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

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
    process.exit(1); // Exit if we can't initialize data storage
  }
};

// Helper functions
const readBookings = async () => {
  try {
    const data = await fs.readFile(bookingsFilePath, "utf8");
    // Add timeout to prevent blocking
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('File read timeout')), 5000);
    });
    
    const dataPromise = JSON.parse(data);
    return await Promise.race([dataPromise, timeoutPromise]);
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
  const { name, date, time, guests, tel } = req.body;
  
  // Check required fields
  if (!name || !date || !time || !guests) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validate name
  if (typeof name !== 'string' || name.length > 100) {
    return res.status(400).json({ error: "Invalid name format" });
  }

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  // Validate time format (HH:MM)
  if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return res.status(400).json({ error: "Invalid time format" });
  }

  // Validate guests number
  const guestsNumber = Number(guests);
  if (isNaN(guestsNumber) || guestsNumber < 1 || guestsNumber > 20) {
    return res.status(400).json({ error: "Invalid guests number (1-20)" });
  }

  // Optional phone number validation
  if (tel && !/^[\d\s\+-]{6,20}$/.test(tel)) {
    return res.status(400).json({ error: "Invalid phone number format" });
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
    const { name, date, time, guests, tel } = req.body;
    const bookings = await readBookings();
    
    const newBooking = {
      id: uuidv4(),
      name: name.trim(),
      date,
      time,
      guests: Number(guests),
      tel: tel ? tel.trim() : undefined
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
    const { name, date, time, guests, tel } = req.body;
    const bookings = await readBookings();
    
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const updatedBooking = {
      ...bookings[index],
      name: name.trim(),
      date,
      time,
      guests: Number(guests),
      tel: tel ? tel.trim() : undefined
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
  
  // Don't send full error details in production
  const errorResponse = process.env.NODE_ENV === 'development' ? 
    { error: err.message, stack: err.stack } : 
    { error: 'Internal Server Error' };
  
  res.status(500).json(errorResponse);
});

// Start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`Secure server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});