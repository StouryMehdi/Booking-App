import React from 'react';
import { render, screen } from '@testing-library/react';
import BookingsList from './BookingsList';
import { BrowserRouter as Router } from 'react-router-dom';

const mockBookings = [
  { name: 'John Doe', date: '2024-09-10', time: '18:00', guests: 4 },
  { name: 'Jane Smith', date: '2024-09-11', time: '19:00', guests: 2 },
];

test('renders BookingsList component', () => {
  render(
    <Router>
      <BookingsList bookings={mockBookings} />
    </Router>
  );

  const bookingRows = screen.getAllByRole('row');
  expect(bookingRows).toHaveLength(mockBookings.length + 1); // +1 for the header row
});