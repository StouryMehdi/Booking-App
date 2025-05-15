import React, { useState, useCallback } from "react";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Snackbar,
  Alert,
  Paper,
  Box,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Select,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import countries from "../data/countries.json";

// Sanitize input function
const sanitizeInput = (input) => {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const BookingForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const initialFormState = {
    name: "",
    date: "",
    time: "",
    guests: "",
    tel: "",
    countryCode: "MA", // Default to Morocco
  };

  const [formData, setFormData] = useState(initialFormState);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api/bookings";

  // Get selected country details
  const selectedCountry =
    countries.find((c) => c.code === formData.countryCode) || countries[0];

  // Extract the phone number without country code for display
  const displayPhoneNumber = formData.tel.startsWith(selectedCountry.dialCode)
    ? formData.tel.substring(selectedCountry.dialCode.length).trim()
    : formData.tel;

  // Memoized handler for better performance
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
  }, []);

  const handleCountryChange = useCallback((e) => {
    const countryCode = e.target.value;
    const country = countries.find((c) => c.code === countryCode);

    // Update phone number with new country code
    const phoneNumber = displayPhoneNumber;
    setFormData((prev) => ({
      ...prev,
      countryCode,
      tel: country.dialCode + (phoneNumber ? " " + phoneNumber : ""),
    }));
  }, [displayPhoneNumber]);

  const handlePhoneChange = useCallback((e) => {
    const value = e.target.value;
    
    // Allow only numbers and spaces
    if (!/^[\d\s]*$/.test(value)) return;

    // Limit to 9 digits
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length > 9) return;

    // Update the phone number with country code
    setFormData((prev) => ({
      ...prev,
      tel: selectedCountry.dialCode + (value ? " " + value : ""),
    }));
  }, [selectedCountry.dialCode]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    // Enhanced validation
    try {
      if (
        !formData.name ||
        !formData.date ||
        !formData.time ||
        !formData.guests ||
        !formData.tel
      ) {
        throw new Error("Please fill in all required fields");
      }

      if (!formData.tel.startsWith(selectedCountry.dialCode)) {
        throw new Error(`Phone number must start with ${selectedCountry.dialCode}`);
      }

      const phoneDigits = formData.tel.replace(/\D/g, "").substring(selectedCountry.dialCode.replace(/\D/g, "").length);
      if (phoneDigits.length < 8 || phoneDigits.length > 9) {
        throw new Error("Phone number must be 8-9 digits");
      }

      const guestsNumber = Number(formData.guests);
      if (isNaN(guestsNumber)) {
        throw new Error("Invalid number of guests");
      }
      if (guestsNumber < 1 || guestsNumber > 20) {
        throw new Error("Number of guests must be between 1 and 20");
      }

      const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
      if (selectedDateTime < new Date()) {
        throw new Error("Please choose a future date and time");
      }

      // Submit data (without CSRF token)
      setLoading(true);
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          date: formData.date,
          time: formData.time,
          guests: guestsNumber,
          tel: formData.tel,
          country: formData.countryCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save booking");
      }

      showNotification(
        "Booking successful! We'll contact you shortly.",
        "success"
      );
      setFormData(initialFormState);
    } catch (error) {
      showNotification(error.message || "Failed to save booking", "error");
    } finally {
      setLoading(false);
    }
  }, [formData, selectedCountry.dialCode, API_URL]);

  const showNotification = useCallback((message, type) => {
    setNotification({ open: true, message, type });
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <Paper
      elevation={4}
      sx={{
        padding: isMobile ? 3 : 4,
        borderRadius: 3,
        backgroundColor: "background.paper",
        maxWidth: 800,
        margin: "0 auto",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 2,
          }}
        >
          Reserve Your Table
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in your details to book a table at our restaurant
        </Typography>
      </Box>
      
      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              inputProps={{ 
                maxLength: 50,
                pattern: "^[a-zA-ZÀ-ÿ\\s'-]+$",
                title: "Please enter a valid name (letters, spaces, hyphens, and apostrophes only)"
              }}
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
              size={isMobile ? "small" : "medium"}
              InputLabelProps={{ shrink: true }}
              inputProps={{ 
                min: today,
                "data-testid": "date-input"
              }}
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
              size={isMobile ? "small" : "medium"}
              InputLabelProps={{ shrink: true }}
              inputProps={{ 
                step: 900,
                "data-testid": "time-input"
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              name="guests"
              label="N° Guests"
              type="number"
              value={formData.guests}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              inputProps={{ 
                min: 1, 
                max: 20,
                "data-testid": "guests-input"
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="tel"
              label="Phone Number"
              value={displayPhoneNumber}
              onChange={handlePhoneChange}
              fullWidth
              required
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selectedCountry.dialCode}
                    </Box>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Select
                      value={formData.countryCode}
                      onChange={handleCountryChange}
                      variant="standard"
                      disableUnderline
                      sx={{
                        "& .MuiSelect-select": {
                          paddingRight: "24px !important",
                          paddingLeft: "8px !important",
                          minWidth: "0 !important",
                          width: "auto",
                        },
                        "& .MuiSelect-icon": {
                          color: theme.palette.text.primary,
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 300,
                            "& .MuiMenuItem-root": {
                              minHeight: "auto",
                              padding: "8px 16px",
                            },
                          },
                        },
                      }}
                      renderValue={() => (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <span style={{ fontSize: "1.2rem" }}>
                            {selectedCountry.flag}
                          </span>
                        </Box>
                      )}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.code} value={country.code}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              width: "100%",
                            }}
                          >
                            <span style={{ fontSize: "1.2rem" }}>
                              {country.flag}
                            </span>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2">
                                {country.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {country.dialCode}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                pattern: "^[\\d\\s]*$",
                title: "Please enter only numbers",
                "data-testid": "phone-input"
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size={isMobile ? "medium" : "large"}
                disabled={loading}
                sx={{
                  py: isMobile ? 1 : 1.5,
                  px: 4,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  boxShadow: "none",
                  minWidth: 200,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Reserve Your Table"
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default BookingForm;