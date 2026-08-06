import { useEffect, useState } from 'react';
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
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import { getInvoices, getExtractions } from '../api/invoices.js';

function statusColor(status) {
  if (status === 'completed') return 'success';
  if (status === 'processing' || status === 'uploaded') return 'info';
  return 'error';
}

export function InvoiceHistoryPage() {
  const [invoices, setInvoices] = useState([]);
  const [extractions, setExtractions] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pdfPreviewOpen, setPdfPreviewOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [invRes, extRes] = await Promise.all([
          getInvoices(),
          getExtractions()
        ]);
        setInvoices(invRes.data || []);

        const extMap = {};
        (extRes.data || []).forEach(ext => {
          extMap[ext.invoice_id] = ext;
        });
        setExtractions(extMap);
      } catch (err) {
        console.error('Error loading history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleOpenDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };

  const handleCloseDetails = () => {
    setDialogOpen(false);
    setSelectedInvoice(null);
    setPdfPreviewOpen(false);
  };

  const filteredItems = invoices.filter((invoice) => {
    const ext = extractions[invoice.id] || {};
    const queryStr = `${invoice.id} ${invoice.filename} ${invoice.status} ${ext.vendor_name || ''} ${ext.invoice_number || ''}`.toLowerCase();
    return queryStr.includes(search.toLowerCase());
  });

  const fileUrl = selectedInvoice ? `http://localhost:8000/api/v1/invoices/${selectedInvoice.id}/file` : '';

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Invoice Repository & History
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse all processed invoices, examine extracted metadata, and inspect original uploaded documents.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Search & Filter Invoices</Typography>
            <Typography variant="body2" color="text.secondary">
              Filter by invoice ID, filename, vendor, or status.
            </Typography>
          </Box>
          <TextField
            placeholder="Search by ID, vendor, filename..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            size="small"
            sx={{ minWidth: 280 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Filename</TableCell>
                <TableCell>Vendor / Extracted Info</TableCell>
                <TableCell>Uploaded Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No invoices matching search criteria.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((invoice) => {
                  const ext = extractions[invoice.id];
                  return (
                    <TableRow key={invoice.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 700 }}>#{invoice.id}</TableCell>
                      <TableCell>{invoice.filename}</TableCell>
                      <TableCell>
                        {ext ? (
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                              {ext.vendor_name || 'Vendor N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Total: {ext.currency || '$'}{ext.total_amount || '0.00'} • Inv #: {ext.invoice_number || 'N/A'}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Processing metadata...
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{new Date(invoice.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip label={invoice.status.toUpperCase()} color={statusColor(invoice.status)} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleOpenDetails(invoice)}
                        >
                          Details & View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Invoice Details & Viewer Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        {selectedInvoice && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Invoice #{selectedInvoice.id} Details
              </Typography>
              <IconButton onClick={handleCloseDetails}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>File Information</Typography>
                  <Typography variant="body1"><strong>Filename:</strong> {selectedInvoice.filename}</Typography>
                  <Typography variant="body2"><strong>Status:</strong> {selectedInvoice.status.toUpperCase()}</Typography>
                  <Typography variant="body2"><strong>Uploaded:</strong> {new Date(selectedInvoice.created_at).toLocaleString()}</Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Extracted Metadata</Typography>
                  {extractions[selectedInvoice.id] ? (
                    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                      <Stack spacing={1}>
                        <Typography variant="body2"><strong>Vendor:</strong> {extractions[selectedInvoice.id].vendor_name || 'N/A'}</Typography>
                        <Typography variant="body2"><strong>Invoice Number:</strong> {extractions[selectedInvoice.id].invoice_number || 'N/A'}</Typography>
                        <Typography variant="body2"><strong>Date:</strong> {extractions[selectedInvoice.id].invoice_date || 'N/A'}</Typography>
                        <Typography variant="body2"><strong>Due Date:</strong> {extractions[selectedInvoice.id].due_date || 'N/A'}</Typography>
                        <Typography variant="body2"><strong>Subtotal:</strong> {extractions[selectedInvoice.id].currency || '$'}{extractions[selectedInvoice.id].subtotal || '0.00'}</Typography>
                        <Typography variant="body2"><strong>Tax Amount:</strong> {extractions[selectedInvoice.id].currency || '$'}{extractions[selectedInvoice.id].tax_amount || '0.00'}</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#4f46e5', mt: 1 }}>
                          Total Amount: {extractions[selectedInvoice.id].currency || '$'}{extractions[selectedInvoice.id].total_amount || '0.00'}
                        </Typography>
                      </Stack>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No extracted metadata record available.</Typography>
                  )}
                </Box>

                {pdfPreviewOpen && (
                  <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                    <iframe
                      src={fileUrl}
                      title="Invoice File Preview"
                      style={{ width: '100%', height: '100%', border: 'none' }}
                    />
                  </Box>
                )}
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              {!pdfPreviewOpen ? (
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  onClick={() => setPdfPreviewOpen(true)}
                >
                  Preview Original Document
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  component="a"
                  href={fileUrl}
                  target="_blank"
                  download
                >
                  Download File
                </Button>
              )}
              <Button variant="outlined" onClick={handleCloseDetails}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
