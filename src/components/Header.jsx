import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import '../styles/Header.scss';
import logo from '../logo.png';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
  };

  const drawerItems = (
    <List>
      <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="/booking-list" onClick={toggleDrawer(false)}>
        <ListItemText primary="Reservations" />
      </ListItem>
      <ListItem button component={Link} to="/menu" onClick={toggleDrawer(false)}>
        <ListItemText primary="Menu" />
      </ListItem>
      <ListItem button component={Link} to="/about" onClick={toggleDrawer(false)}>
        <ListItemText primary="About" />
      </ListItem>
    </List>
  );

  return (
    <AppBar position="static" sx={{ 
      backgroundColor: 'primary.main'
    }}>
      <Toolbar>
        <Button component={Link} to="/" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: 'inherit', 
          textDecoration: 'none',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)'
          }
        }}>
          <img src={logo} alt="Restaurant Logo" style={{ height: 40, marginRight: 10 }} />
          <Typography variant="h6" component="div">
            Little Lemon
          </Typography>
        </Button>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="end"
              onClick={toggleDrawer(true)}
              sx={{ ml: 'auto' }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {drawerItems}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/booking-list"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Reservations
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/Menu"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Menu
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/about"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              About
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;