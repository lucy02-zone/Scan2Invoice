import { Box, Typography, Paper, Grid } from '@mui/material';

export function InvoicesPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Invoice management
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Upload new invoice</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Upload invoices and monitor extraction progress from a single workspace.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Extraction results</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Review AI-extracted invoice data and make manual adjustments before saving.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
