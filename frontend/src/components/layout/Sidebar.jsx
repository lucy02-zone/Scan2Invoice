import PropTypes from 'prop-types';
import { Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Typography, Avatar, Chip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HistoryIcon from '@mui/icons-material/History';
import InsightsIcon from '@mui/icons-material/Insights';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import { ROUTES } from '../../utils/constants.js';
import { useAuth } from '../../contexts/AuthContext.jsx';

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.HOME },
  { label: 'Invoices', icon: <ReceiptLongIcon />, path: ROUTES.INVOICES },
  { label: 'History', icon: <HistoryIcon />, path: ROUTES.HISTORY },
  { label: 'Analytics', icon: <InsightsIcon />, path: ROUTES.ANALYTICS },
  { label: 'Profile', icon: <PersonIcon />, path: ROUTES.PROFILE },
  { label: 'Settings', icon: <SettingsIcon />, path: ROUTES.SETTINGS }
];

export function Sidebar({ mobileOpen, onDrawerToggle, drawerWidth }) {
  const location = useLocation();
  const { user } = useAuth();

  const userInitial = (user?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      {/* Brand Header */}
      <Toolbar sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 22, color: '#ffffff' }} />
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
            Scan2Invoice
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
            AI Workspace v1.0
          </Typography>
        </Box>
      </Toolbar>

      <Divider sx={{ mx: 2, borderColor: '#e2e8f0' }} />

      {/* Navigation List */}
      <List sx={{ flex: 1, px: 2, py: 2 }}>
        {navItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.label}
              component={RouterLink}
              to={item.path}
              selected={isSelected}
              sx={{
                borderRadius: 2.5,
                mb: 0.8,
                px: 2,
                py: 1.2,
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  bgcolor: '#eef2ff',
                  color: '#4f46e5',
                  fontWeight: 700,
                  '& .MuiListItemIcon-root': {
                    color: '#4f46e5',
                  },
                  '&:hover': {
                    bgcolor: '#e0e7ff',
                  },
                },
                '&:hover': {
                  bgcolor: '#f8fafc',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: isSelected ? '#4f46e5' : '#64748b' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.925rem',
                  fontWeight: isSelected ? 700 : 600,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ mx: 2, borderColor: '#e2e8f0' }} />

      {/* Footer User Info */}
      <Box sx={{ p: 2, m: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#4f46e5', fontSize: '0.875rem', fontWeight: 700 }}>
            {userInitial}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.full_name || 'Scan2Invoice User'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.email || 'user@scan2invoice.com'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

Sidebar.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number.isRequired
};
