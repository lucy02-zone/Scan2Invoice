import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Page not found
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Return home
      </Button>
    </Box>
  );
}
