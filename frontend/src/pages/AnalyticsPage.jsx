import { Box, Typography, Paper, Grid, Stack, Chip, LinearProgress } from '@mui/material';

const metrics = [
  { label: 'Extraction accuracy', value: 94, suffix: '%' },
  { label: 'Auto-approved invoices', value: 82, suffix: '%' },
  { label: 'Review requests', value: 14, suffix: '%' },
  { label: 'Average processing time', value: 18, suffix: 'h' }
];

export function AnalyticsPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, minHeight: 320 }}>
            <Typography variant="h6" gutterBottom>
              Workflow performance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Monitor invoice throughput, accuracy trends, and the share of documents that require manual review.
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2">Extraction accuracy</Typography>
                <LinearProgress variant="determinate" value={94} sx={{ height: 10, borderRadius: 2, mt: 1 }} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  94% accuracy rate across all invoices processed in the last 30 days.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Review requests</Typography>
                <LinearProgress variant="determinate" value={14} color="warning" sx={{ height: 10, borderRadius: 2, mt: 1 }} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  14% of invoices were flagged for manual review due to confidence or missing fields.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {metrics.map((metric) => (
              <Grid item xs={12} key={metric.label}>
                <Paper sx={{ p: 3, minHeight: 120 }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {metric.label}
                    </Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="h5">
                        {metric.value}
                        {metric.suffix}
                      </Typography>
                      <Chip label="Live" color="success" size="small" />
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Invoice trend summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This area will display charts for invoice volume, automated approval rates, and processing latency over time.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
