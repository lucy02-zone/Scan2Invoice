import PropTypes from 'prop-types';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Badge } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';

export function AppHeader({ onMenuClick, drawerWidth }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderBottom: '1px solid rgba(145, 158, 171, 0.24)',
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: 'background.paper'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Scan2Invoice
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge badgeContent={3} color="secondary">
            <NotificationsIcon color="action" />
          </Badge>
          <Avatar alt="User" sx={{ width: 36, height: 36 }}>
            S
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

AppHeader.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
  drawerWidth: PropTypes.number.isRequired
};
