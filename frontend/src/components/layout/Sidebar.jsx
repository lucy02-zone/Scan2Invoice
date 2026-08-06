import PropTypes from 'prop-types';
import { Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HistoryIcon from '@mui/icons-material/History';
import InsightsIcon from '@mui/icons-material/Insights';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link as RouterLink } from 'react-router-dom';

import { ROUTES } from '../../utils/constants.js';

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: ROUTES.HOME },
  { label: 'Invoices', icon: <ReceiptLongIcon />, path: ROUTES.INVOICES },
  { label: 'History', icon: <HistoryIcon />, path: ROUTES.HISTORY },
  { label: 'Analytics', icon: <InsightsIcon />, path: ROUTES.ANALYTICS },
  { label: 'Profile', icon: <PersonIcon />, path: ROUTES.PROFILE },
  { label: 'Settings', icon: <SettingsIcon />, path: ROUTES.SETTINGS }
];

export function Sidebar({ mobileOpen, onDrawerToggle, drawerWidth }) {
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2, justifyContent: 'center' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Scan2Invoice
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Invoice AI workspace
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1 }}>
        {navItems.map((item) => (
          <ListItemButton key={item.label} component={RouterLink} to={item.path} sx={{ borderRadius: 1, my: 0.5 }}>
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Ready to achieve better invoice accuracy.
        </Typography>
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
        sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(145, 158, 171, 0.24)' } }}
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
