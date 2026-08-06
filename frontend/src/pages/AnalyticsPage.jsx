import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Stack, Chip, LinearProgress, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getDashboardStats, getInvoices } from '../api/invoices.js';

export function AnalyticsPage() {
  const [stats, setStats] = useState({ total_invoices: 0, completed: 0, processing: 0, uploaded: 0, failed: 0 });
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsRes, invRes] = await Promise.all([
          getDashboardStats(),
          getInvoices()
        ]);
        setStats(statsRes.data || {});
        setInvoices(invRes.data || []);
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const total = stats.total_invoices || 0;
  const completedRate = total > 0 ? Math.round((stats.completed / total) * 100) : 100;
  const failedRate = total > 0 ? Math.round((stats.failed / total) * 100) : 0;
  const processingRate = total > 0 ? Math.round(((stats.processing + stats.uploaded) / total) * 100) : 0;

  const chartData = [
    { name: 'Completed', count: stats.completed || 0 },
    { name: 'Processing', count: stats.processing + stats.uploaded || 0 },
    { name: 'Failed', count: stats.failed || 0 },
  ];

  const dynamicMetrics = [
    { label: 'Extraction Success Rate', value: completedRate, suffix: '%' },
    { label: 'Pending Processing Share', value: processingRate, suffix: '%' },
    { label: 'Error / Failure Rate', value: failedRate, suffix: '%' },
    { label: 'Total Invoices Uploaded', value: total, suffix: '' }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, minHeight: 320 }}>
              <Typography variant="h6" gutterBottom>
                Workflow Performance Metrics
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Monitor invoice extraction throughput, accuracy rate, and error flags computed from database records.
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2">Extraction Success Rate ({completedRate}%)</Typography>
                  <LinearProgress variant="determinate" value={completedRate} color="success" sx={{ height: 10, borderRadius: 2, mt: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {stats.completed} of {total} invoices successfully processed and extracted.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Failed / Needs Review ({failedRate}%)</Typography>
                  <LinearProgress variant="determinate" value={failedRate} color="error" sx={{ height: 10, borderRadius: 2, mt: 1 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {stats.failed} of {total} invoices failed extraction or low confidence.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid container spacing={2}>
              {dynamicMetrics.map((metric) => (
                <Grid item xs={12} sm={6} md={12} key={metric.label}>
                  <Paper sx={{ p: 2.5 }}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {metric.label}
                      </Typography>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h5">
                          {metric.value}
                          {metric.suffix}
                        </Typography>
                        <Chip label="Live DB" color="success" size="small" />
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
                Invoice Status Distribution
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Visual break-down of invoices across completion stages.
              </Typography>

              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
