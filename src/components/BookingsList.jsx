import React, { useState, useEffect } from "react";
import {
  Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Box, IconButton, Menu, MenuItem, Dialog, DialogActions,
  DialogContent, DialogTitle, TextField, Button, Snackbar,
  SnackbarContent, CircularProgress
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editForm, setEditForm] = useState({
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

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/bookings";

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        showNotification(error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [API_URL]);

  const handleMenuClick = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    if (!selectedBooking) return;
    
    setEditForm({
      name: selectedBooking.name,
      date: selectedBooking.date,
      time: selectedBooking.time,
      guests: selectedBooking.guests.toString()
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!selectedBooking?.id) {
      showNotification("No booking selected", "error");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${selectedBooking.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      setBookings(bookings.filter(b => b.id !== selectedBooking.id));
      showNotification("Booking deleted successfully", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
    handleMenuClose();
  };

  const handleUpdate = async () => {
    if (!selectedBooking?.id) return;
  
    const guestsNumber = Number(editForm.guests);
    if (isNaN(guestsNumber) || guestsNumber < 1 || guestsNumber > 20) {
      showNotification("Guests must be between 1-20", "error");
      return;
    }
  
    try {
      const bookingData = {
        name: editForm.name.trim(),
        date: editForm.date,
        time: editForm.time,
        guests: guestsNumber
      };
  
      const response = await fetch(`${API_URL}/${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });
  
      if (!response.ok) {
        throw new Error("Failed to update booking");
      }
  
      // Use the response from server instead of local data
      const updatedBooking = await response.json();
      
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === selectedBooking.id 
            ? { ...booking, ...updatedBooking } // Merge existing with updates
            : booking
        )
      );
      
      setOpenDialog(false);
      showNotification("Booking updated successfully", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ open: true, message, type });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <div className="bookings-list-container">
      <Typography variant="h4" component="h2" gutterBottom>
        Bookings List
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          No bookings available
        </Typography>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N°</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Guests</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking, index) => (
                <TableRow key={booking.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{booking.name}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, booking)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEditClick}>Edit</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={editForm.name}
            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="date"
            label="Date"
            type="date"
            value={editForm.date}
            onChange={(e) => setEditForm({...editForm, date: e.target.value})}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="time"
            label="Time"
            type="time"
            value={editForm.time}
            onChange={(e) => setEditForm({...editForm, time: e.target.value})}
            fullWidth
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="guests"
            label="Number of Guests"
            type="number"
            value={editForm.guests}
            onChange={(e) => setEditForm({...editForm, guests: e.target.value})}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 1, max: 20 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleUpdate}
            disabled={
              !editForm.name ||
              !editForm.date ||
              !editForm.time ||
              !editForm.guests
            }
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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

export default BookingsList;