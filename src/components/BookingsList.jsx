// src/components/BookingList.jsx
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import '../styles/BookingList.scss'; // Import styles

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings data from the JSON file
    const fetchBookings = async () => {
      try {
        const response = await fetch('/data/bookings.json');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" component="h1" gutterBottom>
        Booking List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Guests</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking, index) => (
            <TableRow key={index}>
              <TableCell>{booking.name}</TableCell>
              <TableCell>{booking.date}</TableCell>
              <TableCell>{booking.time}</TableCell>
              <TableCell>{booking.guests}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookingList;
