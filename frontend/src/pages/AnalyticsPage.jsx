import { Box, Typography, Paper } from '@mui/material';

export function AnalyticsPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Analytics with charts and invoice performance KPIs will help stakeholders measure automation success.
        </Typography>
      </Paper>
    </Box>
  );
}
