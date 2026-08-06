import { Box, Typography, Paper } from '@mui/material';

export function InvoiceHistoryPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Invoice history
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Historic invoice records, filters, and paginated status tracking will be available here.
        </Typography>
      </Paper>
    </Box>
  );
}
