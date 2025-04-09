import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Snackbar,
  SnackbarContent,
  Paper,
  Box,
} from "@mui/material";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    guests: "",
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api/bookings";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Paper
      elevation={4}
      sx={{
        padding: 4,
        borderRadius: 5,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 4,
          }}
        >
          Reserve Your Table
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
          </Grid>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              fullWidth
              sx={{
                py: 1.5,
                mt: 2,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 2.5,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              {loading ? "Submitting..." : "Reserve Your Table"}
            </Button>
        </Grid>
      </form>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <SnackbarContent
          message={notification.message}
          sx={{
            backgroundColor:
              notification.type === "success" ? "#4caf50" : "#f44336",
            fontWeight: 500,
            borderRadius: 1,
          }}
        />
      </Snackbar>
    </Paper>
  );
};

export default BookingForm;