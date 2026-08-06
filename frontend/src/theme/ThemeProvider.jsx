import PropTypes from 'prop-types';
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565c0'
    },
    secondary: {
      main: '#ff6f00'
    },
    background: {
      default: '#f4f6fb',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    button: {
      textTransform: 'none'
    }
  }
});

export function ThemeProvider({ children }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};
