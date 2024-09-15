import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import BookingForm from '../components/BookingForm';

test('shows an error message when the booking submission fails', async () => {
  // Mock fetch to simulate failure
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false, // Simulate a failed response
    })
  );

  // Render the component
  render(<BookingForm />);

  // Simulate user input
  fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
  fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2023-09-12' } });
  fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '18:00' } });
  fireEvent.change(screen.getByLabelText(/Guests/i), { target: { value: 4 } });

  // Submit the form
  fireEvent.click(screen.getByText(/Book Table/i));

  // Wait for the error message to appear in the dialog
  await waitFor(() => {
    expect(screen.getByText(/Failed to save the booking./i)).toBeInTheDocument();
  });
});
