import React, { useState } from "react";
import { Button, TextField, Grid, Typography, Snackbar, SnackbarContent } from "@mui/material";
import "../styles/BookingForm.scss";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    guests: ""
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success"
  });
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/bookings";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.date || !formData.time || !formData.guests) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    const guestsNumber = Number(formData.guests);
    if (isNaN(guestsNumber) || guestsNumber < 1 || guestsNumber > 20) {
      showNotification("Number of guests must be between 1 and 20", "error");
      return;
    }

    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    if (selectedDateTime < new Date()) {
      showNotification("Please choose a future date and time", "error");
      return;
    }

    const booking = {
      name: formData.name.trim(),
      date: formData.date,
      time: formData.time,
      guests: guestsNumber,
    };

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save booking");
      }

      showNotification("Booking successful!", "success");
      setFormData({ name: "", date: "", time: "", guests: "" });
    } catch (error) {
      showNotification(error.message || "Failed to save booking", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ open: true, message, type });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <div className="booking-form-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Book a Table
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ maxLength: 50 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="date"
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="time"
              label="Time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 900 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="guests"
              label="Number of Guests"
              type="number"
              value={formData.guests}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{ min: 1, max: 20 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{
                marginTop: 2,
                backgroundColor: "#1976d2",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              {loading ? "Submitting..." : "Reserve Your Table"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <SnackbarContent
          message={notification.message}
          style={{
            backgroundColor: notification.type === "success" ? "#4caf50" : "#f44336",
          }}
        />
      </Snackbar>
    </div>
  );
};

export default BookingForm;