import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#0ea5a4' },
            secondary: { main: '#2563eb' }
          }
        : {
            primary: { main: '#06b6d4' },
            secondary: { main: '#60a5fa' }
          })
    },
    typography: { fontFamily: 'Inter, Roboto, Arial' }
  });
