import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BookingProvider } from './context/BookingContext'; // Adjust the path as necessary

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BookingProvider>
      <App />
    </BookingProvider>
  </React.StrictMode>
);