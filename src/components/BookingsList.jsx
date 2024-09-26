import React, { useState, useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material';

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings'); // Fetch bookings from API
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();

        // Sort bookings from newest to oldest
        const sortedBookings = data.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`); // Create a Date object for each booking
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateB - dateA; // Sort in descending order
        });

        setBookings(sortedBookings); // Set the sorted bookings to state
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings(); // Call the function to fetch bookings
  }, []);

  return (
    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        Bookings List
      </Typography>
      {bookings.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh', // Adjust height to your preference
            bgcolor: 'background.default',
            borderRadius: 1,
            boxShadow: 1,
            mt: 2,
          }}
        >
          <Typography variant="h6" color="textSecondary" textAlign="center">
            No bookings available
          </Typography>
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Guests</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.uuid}> {/* Use UUID as the key for uniqueness */}
                <TableCell>{booking.id}</TableCell> {/* Display the numeric ID */}
                <TableCell>{booking.name}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell>{booking.guests}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default BookingsList;
