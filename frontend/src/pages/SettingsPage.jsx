import { Box, Typography, Paper, FormControlLabel, Switch } from '@mui/material';

export function SettingsPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <FormControlLabel control={<Switch defaultChecked />} label="Enable notifications" />
        <FormControlLabel control={<Switch />} label="Dark mode" />
      </Paper>
    </Box>
  );
}
