import React, { useState } from 'react';
import { Button, TextField, Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import '../styles/BookingForm.scss';

const BookingForm = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form fields
    if (!name || !date || !time || !guests) {
      setMessage('Please fill in all fields.');
      setOpen(true);
      return;
    }

    const booking = { name, date, time, guests };

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });

      const responseData = await response.text(); // Parse response as text

      if (response.ok) {
        setMessage('Booking successful!');
      } else {
        setMessage(`Failed to save the booking. Status: ${response.status}, Message: ${responseData}`);
      }
    } catch (error) {
      console.error('Error during booking submission:', error);
      setMessage('Failed to save the booking.');
    }

    setOpen(true); // Show dialog
  };

  const handleClose = () => {
    setOpen(false);
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Booking Status</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingForm;