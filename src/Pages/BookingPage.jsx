import React, { useState } from 'react';
import BookingForm from '../components/BookingForm';
import BookingsList from '../components/BookingsList';

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);

  const addBooking = (newBooking) => {
    setBookings([...bookings, newBooking]);
  };

  return (
    <div>
      <h1>Book a Table</h1>
      <BookingForm addBooking={addBooking} />
      <BookingsList bookings={bookings} />
    </div>
  );
};

export default BookingPage;