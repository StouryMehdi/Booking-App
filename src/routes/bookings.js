const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { authenticate } = require('../middlewares/auth');
const { validateBooking } = require('../middlewares/validators');
const { readBookings, writeBookings } = require('../utils/db');

// Get all bookings (admin sees all, customers see only their own)
router.get('/', authenticate(), async (req, res) => {
  try {
    const bookings = await readBookings();
    const filteredBookings = req.user.role === 'admin' 
      ? bookings 
      : bookings.filter(b => b.userId === req.user.id);
    
    res.json(filteredBookings);
  } catch (err) {
    console.error('Failed to fetch bookings:', err);
    res.status(500).json({ 
      error: "Failed to fetch bookings",
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    });
  }
});

// Create new booking (customers only)
router.post('/', 
  authenticate(['customer']), 
  validateBooking, 
  async (req, res) => {
    try {
      const { name, date, time, guests, tel } = req.body;
      const bookings = await readBookings();
      
      const newBooking = {
        id: uuidv4(),
        userId: req.user.id,
        name: name.trim(),
        date,
        time,
        guests: Number(guests),
        tel: tel ? tel.trim() : null,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      bookings.push(newBooking);
      await writeBookings(bookings);

      res.status(201).json({
        message: "Booking created successfully",
        booking: newBooking
      });
    } catch (err) {
      console.error('Booking creation error:', err);
      res.status(500).json({ 
        error: "Failed to create booking",
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
      });
    }
  }
);

// Update booking (admin only)
router.put('/:id', 
  authenticate(['admin']),  // Only admin can access
  validateBooking,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, date, time, guests, tel } = req.body;
      const bookings = await readBookings();
      
      const bookingIndex = bookings.findIndex(b => b.id === id);
      if (bookingIndex === -1) {
        return res.status(404).json({ error: "Booking not found" });
      }

      const updatedBooking = {
        ...bookings[bookingIndex],
        name: name.trim(),
        date,
        time,
        guests: Number(guests),
        tel: tel ? tel.trim() : null,
        updatedAt: new Date().toISOString()
      };

      bookings[bookingIndex] = updatedBooking;
      await writeBookings(bookings);

      res.json({
        message: "Booking updated successfully",
        booking: updatedBooking
      });
    } catch (err) {
      console.error('Booking update error:', err);
      res.status(500).json({ 
        error: "Failed to update booking",
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
      });
    }
  }
);

// Delete booking (admin only)
router.delete('/:id', 
  authenticate(['admin']),  // Only admin can access
  async (req, res) => {
    try {
      const { id } = req.params;
      const bookings = await readBookings();
      
      const bookingIndex = bookings.findIndex(b => b.id === id);
      if (bookingIndex === -1) {
        return res.status(404).json({ error: "Booking not found" });
      }

      const [deletedBooking] = bookings.splice(bookingIndex, 1);
      await writeBookings(bookings);

      res.json({ 
        message: "Booking deleted successfully",
        booking: deletedBooking
      });
    } catch (err) {
      console.error('Booking deletion error:', err);
      res.status(500).json({ 
        error: "Failed to delete booking",
        ...(process.env.NODE_ENV === 'development' && { details: err.message })
      });
    }
  }
);

module.exports = router;