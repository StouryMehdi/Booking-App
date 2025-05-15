import { createTheme } from "@mui/material/styles";

// First create the base theme without component overrides
const baseTheme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32",
      light: "#81c784",
      dark: "#1b5e20",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ff8f00",
      light: "#ffc046",
      dark: "#c56000",
      contrastText: "#ffffff",
    },
    error: {
      main: "#d32f2f",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    accent: {
      main: "#5d4037",
      light: "#8d6e63",
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      color: "#2e7d32",
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
});

// Then create the complete theme with component overrides
const theme = createTheme(baseTheme, {
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: baseTheme.palette.primary.main,
          textDecoration: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            color: baseTheme.palette.primary.dark,
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            textDecorationThickness: "2px",
          },
          "&.active": {
            color: baseTheme.palette.secondary.main,
            fontWeight: 600,
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            textDecorationThickness: "2px",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            backgroundColor: "rgba(46, 125, 50, 0.1)",
          },
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          color: "inherit", // Inherits from drawer paper
          "& .MuiListItemButton-root": {
            color: "inherit",
            "&:hover": {
              color: baseTheme.palette.secondary.light,
            },
            "&.Mui-selected": {
              color: baseTheme.palette.secondary.contrastText,
            },
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: baseTheme.palette.primary.dark,
          "& .MuiListItem-root": {
            color: "#ffffff", // Default text color in drawer
            "&:hover": {
              color: baseTheme.palette.secondary.light, // Hover text color
            },
            "&.Mui-selected": {
              color: baseTheme.palette.secondary.contrastText, // Selected text color
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          "& .MuiLink-root": {
            color: "#ffffff",
            "&:hover": {
              color: baseTheme.palette.secondary.light,
            },
          },
        },
      },
    },
  },
});

export default theme;