import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Typography, Snackbar, SnackbarContent } from '@mui/material';
import { v4 as uuidv4 } from "uuid";
import '../styles/BookingForm.scss';

const BookingForm = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // Default alert type
  const [bookingId, setBookingId] = useState(1); // State for booking ID

  const today = new Date().toISOString().split('T')[0];

  // Load the booking ID from local storage
  useEffect(() => {
    const storedId = localStorage.getItem('nextBookingId');
    if (storedId) {
      setBookingId(Number(storedId)); // Load the next ID from local storage
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    if (!name || !date || !time || !guests) {
      setMessage('Please fill in all fields.');
      setAlertType('error'); // Set alert type to error
      setOpen(true);
      return;
    }

    const booking = {
      uuid: uuidv4(),
      name,
      date,
      time,
      guests,
    };

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });

      const responseData = await response.text(); // Parse response as text

      if (response.ok) {
        setMessage('Booking successful!');
        setAlertType('success'); // Set alert type to success
        
        // Increment the booking ID for the next booking
        const nextId = bookingId + 1;
        setBookingId(nextId);
        localStorage.setItem('nextBookingId', nextId); // Save next ID to local storage
      } else {
        setMessage(`Failed to save the booking. Status: ${response.status}, Message: ${responseData}`);
        setAlertType('error'); // Set alert type to error
      }
    } catch (error) {
      console.error('Error during booking submission:', error);
      setMessage('Failed to save the booking.');
      setAlertType('error'); // Set alert type to error
    }

    setOpen(true); // Show Snackbar
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const getSnackbarContentStyle = () => {
    return alertType === 'success' ? { backgroundColor: '#4caf50' } : { backgroundColor: '#f44336' }; // Green for success, Red for error
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Book a Table
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }} // Set min date to today
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Number of Guests"
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" className="button-custom">
              Book Table
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar for alert messages */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <SnackbarContent
          style={getSnackbarContentStyle()}
          message={message}
        />
      </Snackbar>
    </div>
  );
};

export default BookingForm;