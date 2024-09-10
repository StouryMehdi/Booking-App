// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';

const Header = () => (
  <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Little Lemon
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/booking-list">
          Reservations
        </Button>
        <Button color="inherit" component={Link} to="/about">
          About
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
