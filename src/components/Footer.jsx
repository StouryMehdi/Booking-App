import React from 'react';
import { Box, Typography } from '@mui/material';
import '../styles/Footer.scss';

const Footer = () => (
  <Box className="footer" sx={{ p: 2, textAlign: 'center', backgroundColor: '#333', color: '#fff' }}>
    <Typography variant="body2">&copy; 2024 Little Lemon Restaurant</Typography>
  </Box>
);

export default Footer;
