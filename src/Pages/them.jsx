// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Deep green
      light: '#81c784',
      dark: '#1b5e20',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ff8f00', // Warm orange
      light: '#ffc046',
      dark: '#c56000',
      contrastText: '#ffffff'
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    accent: {
      main: '#5d4037', // Brown
      light: '#8d6e63',
    }
  },
  typography: {
    fontFamily: '"Playfair Display", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#2e7d32',
    },
    h2: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;