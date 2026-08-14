import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Grid,
  TextField,
  Button,
  Stack
} from '@mui/material';
import { useColorMode } from '../theme/ThemeProvider.jsx';

export function SettingsPage() {
  const { mode, toggleColorMode } = useColorMode();
  const [settings, setSettings] = useState({
    notifications: true,
    autoApprove: false,
    retentionDays: 90
  });

  const handleToggle = (field) => (event) => {
    setSettings((prev) => ({ ...prev, [field]: event.target.checked }));
  };

  const handleNumberChange = (event) => {
    const value = Number(event.target.value);
    setSettings((prev) => ({ ...prev, retentionDays: Number.isNaN(value) ? prev.retentionDays : value }));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Application preferences
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications}
                    onChange={handleToggle('notifications')}
                  />
                }
                label="Enable notifications"
              />
              <FormControlLabel
                control={
                  <Switch checked={mode === 'dark'} onChange={toggleColorMode} />
                }
                label="Dark mode"
              />
              <FormControlLabel
                control={
                  <Switch checked={settings.autoApprove} onChange={handleToggle('autoApprove')} />
                }
                label="Auto-approve routine invoices"
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Data retention
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Control how long invoice records are kept in the system before archive or deletion.
            </Typography>
            <TextField
              type="number"
              label="Retention period (days)"
              value={settings.retentionDays}
              onChange={handleNumberChange}
              fullWidth
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Security & account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Protect your account with strong access controls and session management.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="outlined">Change password</Button>
              <Button variant="outlined">Manage API keys</Button>
              <Button variant="outlined">Review active sessions</Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
