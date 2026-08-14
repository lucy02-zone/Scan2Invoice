import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';

const ColorModeContext = createContext({
  mode: 'light',
  toggleColorMode: () => {},
  setMode: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('scan2invoice_theme_mode');
      if (savedMode === 'dark' || savedMode === 'light') {
        return savedMode;
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const setMode = useCallback((newMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('scan2invoice_theme_mode', newMode);
    }
  }, []);

  const toggleColorMode = useCallback(() => {
    setModeState((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('scan2invoice_theme_mode', next);
      }
      return next;
    });
  }, []);

  const theme = useMemo(() => {
    const isDark = mode === 'dark';
    return createTheme({
      palette: {
        mode,
        primary: {
          main: '#6366f1', // Modern Indigo
          light: isDark ? '#818cf8' : '#eef2ff',
          dark: '#4338ca',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#0284c7',
          light: isDark ? '#38bdf8' : '#e0f2fe',
          dark: '#0369a1',
        },
        success: {
          main: '#10b981',
          light: isDark ? 'rgba(16, 185, 129, 0.15)' : '#d1fae5',
          dark: '#047857',
        },
        warning: {
          main: '#f59e0b',
          light: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7',
          dark: '#b45309',
        },
        error: {
          main: '#ef4444',
          light: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
          dark: '#b91c1c',
        },
        background: {
          default: isDark ? '#0f172a' : '#f8fafc',
          paper: isDark ? '#1e293b' : '#ffffff',
        },
        text: {
          primary: isDark ? '#f8fafc' : '#0f172a',
          secondary: isDark ? '#94a3b8' : '#64748b',
        },
        divider: isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(226, 232, 240, 0.8)',
      },
      shape: {
        borderRadius: 12,
      },
      typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h4: {
          fontWeight: 800,
          letterSpacing: '-0.025em',
        },
        h5: {
          fontWeight: 700,
          letterSpacing: '-0.02em',
        },
        h6: {
          fontWeight: 700,
          letterSpacing: '-0.015em',
        },
        subtitle1: {
          fontWeight: 600,
        },
        subtitle2: {
          fontWeight: 600,
        },
        button: {
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.01em',
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              color: isDark ? '#f8fafc' : '#0f172a',
              transition: 'background-color 0.2s ease, color 0.2s ease',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              boxShadow: isDark
                ? '0px 4px 20px rgba(0, 0, 0, 0.3), 0px 1px 3px rgba(0, 0, 0, 0.2)'
                : '0px 4px 20px rgba(15, 23, 42, 0.04), 0px 1px 3px rgba(15, 23, 42, 0.02)',
              border: isDark ? '1px solid rgba(148, 163, 184, 0.15)' : '1px solid rgba(226, 232, 240, 0.8)',
              borderRadius: 16,
            },
            elevation0: {
              boxShadow: 'none',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              padding: '8px 18px',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: isDark ? '0px 4px 12px rgba(99, 102, 241, 0.35)' : '0px 4px 12px rgba(79, 70, 229, 0.25)',
              },
            },
            containedPrimary: {
              background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              fontWeight: 600,
              borderRadius: 8,
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              fontWeight: 700,
              backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              color: isDark ? '#cbd5e1' : '#475569',
              borderBottom: isDark ? '1px solid rgba(148, 163, 184, 0.15)' : '2px solid #e2e8f0',
            },
            body: {
              borderBottom: isDark ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid #e2e8f0',
            },
          },
        },
        MuiDrawer: {
          styleOverrides: {
            paper: {
              borderRight: isDark ? '1px solid rgba(148, 163, 184, 0.15)' : '1px solid #e2e8f0',
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              borderBottom: isDark ? '1px solid rgba(148, 163, 184, 0.15)' : '1px solid #e2e8f0',
            },
          },
        },
      },
    });
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode,
      setMode,
    }),
    [mode, toggleColorMode, setMode]
  );

  return (
    <ColorModeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
