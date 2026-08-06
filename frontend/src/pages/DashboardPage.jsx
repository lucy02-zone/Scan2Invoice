import { Box, Typography, Paper, Grid } from '@mui/material';

export function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Invoice volume</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Your recent invoice uploads, processing status, and AI results will appear here.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Activity insights</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Analytics cards and KPIs will help you measure performance and extracted invoice accuracy.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
