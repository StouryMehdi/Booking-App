import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
  Pagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from '@mui/material/styles';

const BookingsList = () => {
  const theme = useTheme();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    date: "",
    time: "",
    guests: "",
    tel: "",
  });
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api/bookings";

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
        console.log(setLoading)
      }
    };
    fetchBookings();
  }, [API_URL]);

  // Pagination calculations
  const pageCount = Math.ceil(bookings.length / itemsPerPage);
  const currentItems = bookings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      guests: selectedBooking.guests.toString(),
      tel: selectedBooking.tel,
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
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }

      setBookings(bookings.filter((b) => b.id !== selectedBooking.id));
      showNotification("Booking deleted successfully", "success");
    } catch (error) {
      showNotification(error.message, "error");
    }
    handleMenuClose();
  };

  const handleUpdate = async () => {
    if (!selectedBooking?.id) return;

    const guestsNumber = Number(editForm.guests);
    if (isNaN(guestsNumber)) {
      showNotification("Please enter a valid number of guests", "error");
      return;
    }

    try {
      const bookingData = {
        name: editForm.name.trim(),
        date: editForm.date,
        time: editForm.time,
        guests: guestsNumber,
        tel: editForm.tel,
      };

      const response = await fetch(`${API_URL}/${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Failed to update booking");
      }

      const updatedBooking = await response.json();

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, ...updatedBooking }
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
    setNotification((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ color: "primary.main" }}
      >
        Bookings List
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : bookings.length === 0 ? (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          No bookings available
        </Typography>
      ) : (
        <>
          <Table
            sx={{
              "& .MuiTableCell-head": {
                backgroundColor: "primary.light",
                color: "primary.contrastText",
                fontWeight: 600,
              },
              "& .MuiTableRow-root:hover": {
                backgroundColor: "rgba(129, 199, 132, 0.1)",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>N°</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Guests</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((booking, index) => (
                <TableRow key={booking.id}>
                  <TableCell>{(page - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>{booking.name}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.guests}</TableCell>
                  <TableCell>
                    <Box
                      component="a"
                      href={`tel:${booking.tel.replace(/[^\d+]/g, "")}`}
                      sx={{
                        color: "inherit",
                        textDecoration: "none",
                        display: "block",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          color: theme.palette.primary.main,
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {booking.tel}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, booking)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {pageCount > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    "&.Mui-selected": {
                      fontWeight: "bold",
                    },
                  },
                }}
              />
            </Box>
          )}

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
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="date"
            label="Date"
            type="date"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
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
            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
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
            onChange={(e) =>
              setEditForm({ ...editForm, guests: e.target.value })
            }
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 1, max: 20 }}
          />
          <TextField
            name="tel"
            label="Phone Number"
            value={editForm.tel}
            onChange={(e) => setEditForm({ ...editForm, tel: e.target.value })}
            fullWidth
            margin="normal"
            required
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
              !editForm.guests ||
              !editForm.tel
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookingsList;