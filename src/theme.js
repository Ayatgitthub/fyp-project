import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d472c',
    },
    secondary: {
      main: '#f5b041', // Suitable secondary color (warm amber/yellow)
    },
    error: {
      main: '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    body1: {
      fontSize: '16px',
    },
    body2: {
      fontSize: '14px',
    },
    h3: {
      fontSize: '18px',
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontSize: '16px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
        sizeSmall: {
          padding: '6px 12px',
        },
        sizeMedium: {
          padding: '8px 16px',
        },
        sizeLarge: {
          padding: '12px 40px',
        },
      },
    },
  },
});

export default theme;
