import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Badge, Menu, MenuItem, Tooltip, Chip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext.jsx';
import { getDashboardStats } from '../../api/invoices.js';
import { ROUTES } from '../../utils/constants.js';

const titleMap = {
  [ROUTES.HOME]: 'Dashboard Overview',
  [ROUTES.INVOICES]: 'Invoice Processing & Extraction',
  [ROUTES.HISTORY]: 'Invoice Repository & History',
  [ROUTES.ANALYTICS]: 'Performance Analytics',
  [ROUTES.PROFILE]: 'User Account Profile',
  [ROUTES.SETTINGS]: 'System Settings',
};

export function AppHeader({ onMenuClick, drawerWidth }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await getDashboardStats();
        if (res.data) {
          setAlertCount(res.data.failed || 0);
        }
      } catch (err) {
        // silent catch
      }
    }
    fetchAlerts();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate(ROUTES.PROFILE);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    logout();
  };

  const initial = (user?.full_name || user?.email || 'U').charAt(0).toUpperCase();
  const currentTitle = titleMap[location.pathname] || 'Workspace';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem' }}>
            {currentTitle}
          </Typography>
          <Chip
            icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important', color: '#4f46e5 !important' }} />}
            label="AI Engine Active"
            size="small"
            sx={{
              bgcolor: '#eef2ff',
              color: '#4f46e5',
              fontWeight: 700,
              fontSize: '0.75rem',
              display: { xs: 'none', sm: 'inline-flex' }
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title={alertCount > 0 ? `${alertCount} invoice alerts` : 'No alerts'}>
            <IconButton onClick={() => navigate(ROUTES.ANALYTICS)} sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <Badge badgeContent={alertCount} color="error">
                <NotificationsIcon color="action" sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Box
            onClick={handleMenuOpen}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.2,
              cursor: 'pointer',
              py: 0.5,
              px: 1.5,
              borderRadius: 3,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: '#f1f5f9',
              },
            }}
          >
            <Avatar alt={user?.full_name || 'User'} sx={{ width: 32, height: 32, bgcolor: '#4f46e5', fontSize: '0.875rem', fontWeight: 700 }}>
              {initial}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', display: { xs: 'none', sm: 'block' } }}>
              {user?.full_name?.split(' ')[0] || 'Account'}
            </Typography>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 180,
                borderRadius: 3,
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                border: '1px solid #e2e8f0'
              }
            }}
          >
            <MenuItem onClick={handleProfileClick} sx={{ py: 1.2, fontWeight: 600 }}>
              <PersonIcon fontSize="small" sx={{ mr: 1.5, color: '#4f46e5' }} />
              My Profile
            </MenuItem>
            <MenuItem onClick={handleLogoutClick} sx={{ py: 1.2, fontWeight: 600, color: 'error.main' }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

AppHeader.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number.isRequired
};
