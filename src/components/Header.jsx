import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import logo from "../logo.png";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerItems = (
    <List sx={{ padding: "0 16px" }}>
      {[
        { text: "Home", path: "/" },
        { text: "Reservations", path: "/booking-list" },
        { text: "Menu", path: "/menu" },
        { text: "About", path: "/about" },
      ].map((item) => (
        <ListItem
          button
          key={item.text}
          component={Link}
          to={item.path}
          onClick={toggleDrawer(false)}
          selected={location.pathname === item.path}
          sx={{
            borderRadius: "8px",
            marginBottom: "8px",
            color: theme.palette.text.primary, // Default text color
            "&:hover": {
              backgroundColor: theme.palette.primary.light + "80",
              color: theme.palette.primary.dark, // Text color on hover
            },
            "&.Mui-selected": {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText, // Text color when selected
              "& .MuiListItemText-primary": {
                fontWeight: "bold",
              },
              "&:hover": {
                backgroundColor: theme.palette.secondary.dark,
                color: theme.palette.secondary.contrastText, // Text color when selected+hover
              },
            },
          }}
        >
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontFamily: theme.typography.fontFamily,
              fontWeight: location.pathname === item.path ? 600 : 500,
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "primary.main",
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.primary.light}`,
      }}
    >
      <Toolbar>
        <Button
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
            },
          }}
        >
          <img
            src={logo}
            alt="Restaurant Logo"
            style={{ height: 40, marginRight: 10 }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ fontFamily: theme.typography.fontFamily }}
          >
            Little Lemon
          </Typography>
        </Button>

        {isMobile ? (
          <>
            <IconButton
              color="inherit"
              edge="end"
              onClick={toggleDrawer(true)}
              sx={{
                ml: "auto",
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                  transform: "scale(1.1)",
                  transition: "transform 0.3s ease",
                },
              }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              sx={{
                "& .MuiDrawer-paper": {
                  width: 280,
                  backgroundColor: theme.palette.primary.dark,
                  color: theme.palette.primary.contrastText,
                  padding: "20px 0",
                  boxShadow: theme.shadows[10],
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "0 16px",
                }}
              >
                <IconButton onClick={toggleDrawer(false)}>
                  <CloseIcon
                    sx={{ color: theme.palette.primary.contrastText }}
                  />
                </IconButton>
              </Box>
              {drawerItems}
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2, ml: "auto" }}>
            {["Home", "Reservations", "Menu", "About"].map((item) => (
              <Button
                key={item}
                color="inherit"
                component={Link}
                to={`/${
                  item.toLowerCase() === "home" ? "" : item.toLowerCase()
                }`}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "translateY(-2px)",
                    transition: "transform 0.3s ease",
                  },
                  fontFamily: theme.typography.fontFamily,
                  fontWeight: 500,
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;