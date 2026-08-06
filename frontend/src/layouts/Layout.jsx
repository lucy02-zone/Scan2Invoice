import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

import { AppHeader } from '../components/layout/AppHeader.jsx';
import { AppFooter } from '../components/layout/AppFooter.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';

const drawerWidth = 280;

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppHeader onMenuClick={handleDrawerToggle} drawerWidth={drawerWidth} />
        <Container sx={{ flex: 1, py: 4, width: '100%' }} maxWidth="xl">
          <Outlet />
        </Container>
        <AppFooter />
      </Box>
    </Box>
  );
}
