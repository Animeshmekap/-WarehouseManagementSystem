import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store from './store';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { getTheme } from './theme';

const Root = () => {
  const [mode, setMode] = useState(localStorage.getItem('theme') || 'light');
  const theme = useMemo(() => getTheme(mode), [mode]);
  const toggleTheme = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next); localStorage.setItem('theme', next);
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <BrowserRouter>
            <App toggleTheme={toggleTheme} themeMode={mode} />
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<React.StrictMode><Root /></React.StrictMode>);
