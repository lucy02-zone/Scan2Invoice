import { useState, useEffect } from 'react';
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
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext.jsx';
import { updateProfile } from '../api/auth.js';

export function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    company: 'Scan2Invoice Inc.',
    timezone: 'UTC+0'
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.full_name || user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (field) => (event) => {
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));
    setSuccess(null);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await updateProfile({
        current_email: user?.email,
        full_name: profile.name,
        email: profile.email
      });

      updateUser({
        full_name: res.data.full_name,
        email: res.data.email
      });

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const initial = (profile.name || user?.full_name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Stack alignItems="center" spacing={2}>
              <Avatar sx={{ width: 96, height: 96, bgcolor: 'primary.main', fontSize: 36 }}>{initial}</Avatar>
              <Typography variant="h6">{profile.name || 'User'}</Typography>
              <Chip label={user?.role?.toUpperCase() || 'USER'} color="primary" />
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Update your profile, contact details, and account preferences.
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="h6">Account Details</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  value={profile.name}
                  fullWidth
                  onChange={handleChange('name')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
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
                <Typography variant="subtitle1">Security & Account</Typography>
                <Typography variant="body2" color="text.secondary">
                  Save your updated account details to the backend database.
                </Typography>
              </Box>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
