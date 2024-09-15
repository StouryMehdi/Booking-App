// src/components/Header.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';
import logo from '../logo.png';

const Header = () => (
  <AppBar position="static" sx={{ backgroundColor: '#2e7d32' }}>
    <Toolbar>
      <Button component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
        <img src={logo} alt="Little Lemon Logo" style={{ height: 40, marginRight: 10 }} />
        <Typography variant="h6" component="div">
          Little Lemon
        </Typography>
      </Button>

      <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
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