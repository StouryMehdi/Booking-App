import React from 'react';
import BookingForm from '../components/BookingForm';

const HomePage = () => (
  <div className='ctn'>
      <title>Home Page - Table Booking</title>
      <meta name="description" content="Book a table at Little Lemon restaurant with our easy-to-use booking form." />
      <meta name="keywords" content="table booking, restaurant, Little Lemon, reservation" />
    <h1>Table Booking Form</h1>
    <BookingForm />
  </div>
);

export default HomePage;
