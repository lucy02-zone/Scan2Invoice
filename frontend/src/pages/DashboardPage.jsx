import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';

const invoiceSummaries = [
  { id: 'INV-1001', vendor: 'Acme Supplies', amount: '$1,240.00', status: 'Processed' },
  { id: 'INV-1002', vendor: 'Brightside Logistics', amount: '$560.00', status: 'Review' },
  { id: 'INV-1003', vendor: 'Gulfstream Services', amount: '$2,150.00', status: 'Failed' }
];

export function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, minHeight: 160 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total invoices
            </Typography>
            <Typography variant="h3">128</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Total invoices processed this month with AI extraction and approval tracking.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, minHeight: 160 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Processing status
            </Typography>
            <Typography variant="h3">24</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Invoices currently in review or awaiting manual validation.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, minHeight: 160 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Accuracy alerts
            </Typography>
            <Typography variant="h3">5</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Invoices flagged for low confidence or missing required fields.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h6">Recent invoices</Typography>
                <Typography variant="body2" color="text.secondary">
                  Latest uploads and extraction status for your review queue.
                </Typography>
              </Box>
              <Button variant="contained">Upload invoice</Button>
            </Stack>

            <List>
              {invoiceSummaries.map((invoice, index) => (
                <Box key={invoice.id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemText
                      primary={invoice.id}
                      secondary={`${invoice.vendor} • ${invoice.amount}`}
                    />
                    <Chip
                      label={invoice.status}
                      color={invoice.status === 'Processed' ? 'success' : invoice.status === 'Review' ? 'warning' : 'error'}
                    />
                  </ListItem>
                  {index < invoiceSummaries.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Quick actions</Typography>
            <Button variant="outlined" fullWidth>
              View invoice history
            </Button>
            <Button variant="outlined" fullWidth>
              Open analytics
            </Button>
            <Button variant="outlined" fullWidth>
              Update profile
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
