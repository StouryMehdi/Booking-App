import React, { useReducer, useEffect, useState } from 'react';
import BookingForm from '../components/BookingForm';
import BookingsList from '../components/BookingsList';
import { initializeTimes, updateTimes } from '../utils/reducer';
import { Container, Typography, Box } from '@mui/material';

const BookingPage = () => {
  const [availableTimes, dispatch] = useReducer(updateTimes, initializeTimes());
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('/data/bookings.json');
        const data = await response.json();
        setReservations(data);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <Container>
      <Box mt={4} mb={2}>
        <Typography variant="h3" component="h1" align="center">
          Book a Table
        </Typography>
      </Box>

      <Box mb={5}>
        <BookingForm availableTimes={availableTimes} dispatch={dispatch} />
      </Box>

      <Typography variant="h4" component="h2" align="center" sx={{ mt: 4 }}>
        Your Reservations
      </Typography>
      <BookingsList bookings={reservations} />
    </Container>
  );
};

export default BookingPage;