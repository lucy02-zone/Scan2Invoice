import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { getDashboardStats, getInvoices } from '../api/invoices.js';
import { ROUTES } from '../utils/constants.js';

function statusColor(status) {
  if (status === 'completed') return 'success';
  if (status === 'processing' || status === 'uploaded') return 'info';
  return 'error';
}

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_invoices: 0, completed: 0, processing: 0, uploaded: 0, failed: 0 });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsRes, invoicesRes] = await Promise.all([
          getDashboardStats(),
          getInvoices({ limit: 5 })
        ]);
        setStats(statsRes.data);
        setRecentInvoices(invoicesRes.data || []);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, minHeight: 160 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total Invoices
            </Typography>
            <Typography variant="h3">{loading ? <CircularProgress size={30} /> : stats.total_invoices}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Total invoices processed with AI extraction and approval tracking.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, minHeight: 160 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Processing Status
            </Typography>
            <Typography variant="h3">{loading ? <CircularProgress size={30} /> : stats.processing + stats.uploaded}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Invoices currently uploaded or being processed by the AI pipeline.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, minHeight: 160 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Accuracy Alerts / Failures
            </Typography>
            <Typography variant="h3">{loading ? <CircularProgress size={30} /> : stats.failed}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Invoices flagged for extraction errors or low confidence.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h6">Recent Invoices</Typography>
                <Typography variant="body2" color="text.secondary">
                  Latest uploads and extraction status for your review queue.
                </Typography>
              </Box>
              <Button variant="contained" onClick={() => navigate(ROUTES.INVOICES)}>
                Upload Invoice
              </Button>
            </Stack>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : recentInvoices.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                No invoices found. Upload an invoice to get started!
              </Typography>
            ) : (
              <List>
                {recentInvoices.map((invoice, index) => (
                  <Box key={invoice.id}>
                    <ListItem sx={{ py: 2 }}>
                      <ListItemText
                        primary={`#${invoice.id} - ${invoice.filename}`}
                        secondary={`Uploaded: ${new Date(invoice.created_at).toLocaleString()}`}
                      />
                      <Chip
                        label={invoice.status.toUpperCase()}
                        color={statusColor(invoice.status)}
                      />
                    </ListItem>
                    {index < recentInvoices.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Quick Actions</Typography>
            <Button variant="outlined" fullWidth onClick={() => navigate(ROUTES.HISTORY)}>
              View Invoice History
            </Button>
            <Button variant="outlined" fullWidth onClick={() => navigate(ROUTES.ANALYTICS)}>
              Open Analytics
            </Button>
            <Button variant="outlined" fullWidth onClick={() => navigate(ROUTES.PROFILE)}>
              Update Profile
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
