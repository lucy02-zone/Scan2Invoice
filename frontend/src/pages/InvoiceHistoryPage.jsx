import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Stack,
  Button
} from '@mui/material';

const historyItems = [
  { id: 'INV-1001', vendor: 'Acme Supplies', amount: '$1,240.00', date: '2026-07-30', status: 'Paid' },
  { id: 'INV-1002', vendor: 'Brightside Logistics', amount: '$560.00', date: '2026-07-28', status: 'Pending' },
  { id: 'INV-1003', vendor: 'Gulfstream Services', amount: '$2,150.00', date: '2026-07-25', status: 'Failed' },
  { id: 'INV-1004', vendor: 'North Star Media', amount: '$870.00', date: '2026-07-23', status: 'Review' }
];

function statusColor(status) {
  if (status === 'Paid') return 'success';
  if (status === 'Pending') return 'warning';
  if (status === 'Failed') return 'error';
  return 'info';
}

export function InvoiceHistoryPage() {
  const [search, setSearch] = useState('');

  const filteredItems = historyItems.filter((invoice) =>
    `${invoice.id} ${invoice.vendor} ${invoice.status}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Invoice history
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body1">Review past invoices, status changes, and processing outcomes.</Typography>
            <Typography variant="body2" color="text.secondary">
              Filter by ID, vendor, or status to find invoices quickly.
            </Typography>
          </Box>
          <TextField
            label="Search invoices"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            size="small"
          />
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice ID</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((invoice) => (
              <TableRow key={invoice.id} hover>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.vendor}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>
                  <Chip label={invoice.status} color={statusColor(invoice.status)} size="small" />
                </TableCell>
                <TableCell align="right">
                  <Button size="small" variant="outlined">
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
