import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import BookingForm from '../components/BookingForm';
import userEvent from '@testing-library/user-event';

describe('BookingForm', () => {
  const mockBookingData = {
    name: 'John Doe',
    date: '2023-09-12',
    time: '18:00',
    guests: 4,
    tel: '+1234567890'
  };

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Booking created' }),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const fillForm = async (data) => {
    await userEvent.type(screen.getByLabelText(/Name/i), data.name);
    await userEvent.type(screen.getByLabelText(/Date/i), data.date);
    await userEvent.type(screen.getByLabelText(/Time/i), data.time);
    await userEvent.type(screen.getByLabelText(/Number of Guests/i), data.guests.toString());
    if (data.tel) {
      await userEvent.type(screen.getByLabelText(/Phone Number/i), data.tel);
    }
  };

  test('successfully submits booking with valid data', async () => {
    render(<BookingForm />);
    await fillForm(mockBookingData);

    fireEvent.click(screen.getByRole('button', { name: /Book Table/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.any(String), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer undefined' // Adjust if you pass token
        },
        body: JSON.stringify({
          name: 'John Doe',
          date: '2023-09-12',
          time: '18:00',
          guests: 4,
          tel: '+1234567890'
        }),
      });
    });

    expect(await screen.findByText(/Booking created/i)).toBeInTheDocument();
  });

  test('shows error message when submission fails', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Failed to save the booking' }),
      })
    );

    render(<BookingForm />);
    await fillForm(mockBookingData);
    fireEvent.click(screen.getByRole('button', { name: /Book Table/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to save the booking/i)).toBeInTheDocument();
    });
  });

  test('shows validation errors for empty required fields', async () => {
    render(<BookingForm />);
    fireEvent.click(screen.getByRole('button', { name: /Book Table/i }));

    expect(await screen.findAllByText(/required/i)).toHaveLength(4); // For all required fields
    expect(fetch).not.toHaveBeenCalled();
  });

  test('handles network errors', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    );

    render(<BookingForm />);
    await fillForm(mockBookingData);
    fireEvent.click(screen.getByRole('button', { name: /Book Table/i }));

    expect(await screen.findByText(/Network error/i)).toBeInTheDocument();
  });

  test('disables submit button during submission', async () => {
    let resolveFetch;
    global.fetch.mockImplementationOnce(() => new Promise((resolve) => {
      resolveFetch = resolve;
    }));

    render(<BookingForm />);
    await fillForm(mockBookingData);
    const submitButton = screen.getByRole('button', { name: /Book Table/i });
    
    fireEvent.click(submitButton);
    expect(submitButton).toBeDisabled();

    resolveFetch({
      ok: true,
      json: () => Promise.resolve({ message: 'Booking created' }),
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});