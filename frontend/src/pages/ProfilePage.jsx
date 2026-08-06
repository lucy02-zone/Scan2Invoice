import { Box, Typography, Paper, Avatar, Grid } from '@mui/material';

export function ProfilePage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 72, height: 72 }}>S</Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h6">Scan2Invoice user</Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your account preferences and profile details.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
