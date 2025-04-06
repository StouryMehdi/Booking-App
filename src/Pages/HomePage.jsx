import React from 'react';
import BookingForm from '../components/BookingForm';
import { Box, Typography } from '@mui/material';
import BgImg from '../bg-rstaurant.jpg';
const HomePage = () => {
  return (
    <Box sx={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${BgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // filter: 'blur(1px)',
          zIndex: -1,
        }}
      />
      <Box 
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: 4,
          position: 'relative',
          zIndex: 1,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Reserve Your Table
        </Typography>
        <BookingForm />
      </Box>
      
      <Box 
        sx={{
          height: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
          backgroundColor: 'white',
        }}
      >
      </Box>
    </Box>
  );
};

export default HomePage;