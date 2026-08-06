import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  TextField,
  Button,
  Stack,
  Divider,
  Chip
} from '@mui/material';

export function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Scan2Invoice User',
    email: 'user@example.com',
    company: 'Scan2Invoice Inc.',
    timezone: 'UTC+0'
  });

  const handleChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Stack alignItems="center" spacing={2}>
              <Avatar sx={{ width: 96, height: 96 }}>S</Avatar>
              <Typography variant="h6">Scan2Invoice User</Typography>
              <Chip label="Administrator" color="primary" />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Update your profile, contact details, and account preferences from here.
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6">Account details</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  value={profile.name}
                  fullWidth
                  onChange={handleChange('name')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={profile.email}
                  fullWidth
                  onChange={handleChange('email')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Company"
                  value={profile.company}
                  fullWidth
                  onChange={handleChange('company')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Timezone"
                  value={profile.timezone}
                  fullWidth
                  onChange={handleChange('timezone')}
                />
              </Grid>
            </Grid>

            <Divider />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle1">Security settings</Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage password recovery, API keys, and session security.
                </Typography>
              </Box>
              <Button variant="contained">Update profile</Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
