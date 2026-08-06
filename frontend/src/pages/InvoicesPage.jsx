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
  Divider,
  LinearProgress,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArticleIcon from '@mui/icons-material/Article';

import { processInvoice, getExtractions } from '../api/invoices.js';
import { ROUTES } from '../utils/constants.js';

export function InvoicesPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const [extractions, setExtractions] = useState([]);
  const [loadingExtractions, setLoadingExtractions] = useState(true);

  // Document Viewer Modal State
  const [viewInvoiceId, setViewInvoiceId] = useState(null);
  const [viewInvoiceName, setViewInvoiceName] = useState('');
  const [viewerOpen, setViewerOpen] = useState(false);

  const fetchExtractions = async () => {
    try {
      setLoadingExtractions(true);
      const res = await getExtractions();
      setExtractions(res.data || []);
    } catch (err) {
      console.error('Error fetching extractions:', err);
    } finally {
      setLoadingExtractions(false);
    }
  };

  useEffect(() => {
    fetchExtractions();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const response = await processInvoice(selectedFile, (progressEvent) => {
        if (progressEvent.total) {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      });

      setUploadSuccess(response.data.message || 'Invoice uploaded and extracted successfully!');
      setSelectedFile(null);
      await fetchExtractions();
    } catch (error) {
      setUploadError(error.response?.data?.detail || 'Invoice upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenViewer = (invoiceId, filename) => {
    setViewInvoiceId(invoiceId);
    setViewInvoiceName(filename || `Invoice #${invoiceId}`);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setViewInvoiceId(null);
  };

  const fileUrl = viewInvoiceId ? `http://localhost:8000/api/v1/invoices/${viewInvoiceId}/file` : '';

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Invoice Management & AI Extraction
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload scanned invoices or PDF files to run automated text extraction, entity parsing, and line-item detection.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Upload Column */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 3.5, position: 'relative', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CloudUploadIcon color="primary" /> Upload New Document
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Select a PDF or image invoice. AI models will extract invoice number, vendor, date, and totals.
            </Typography>

            {/* Custom Drag & Drop Box */}
            <Box
              component="label"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justify: 'center',
                p: 4,
                borderRadius: 3,
                border: '2px dashed #a5b4fc',
                bgcolor: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#eef2ff',
                  borderColor: '#4f46e5',
                },
              }}
            >
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: '#e0e7ff',
                  color: '#4f46e5',
                  mb: 2,
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0f172a' }}>
                {selectedFile ? selectedFile.name : 'Click or drop file to upload'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Supports PDF, PNG, JPG (Max 25MB)
              </Typography>
            </Box>

            {selectedFile && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#eef2ff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ArticleIcon color="primary" />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedFile.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{(selectedFile.size / 1024).toFixed(1)} KB</Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => setSelectedFile(null)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            {uploadError && <Alert severity="error" sx={{ mt: 2 }}>{uploadError}</Alert>}
            {uploadSuccess && <Alert severity="success" sx={{ mt: 2 }}>{uploadSuccess}</Alert>}
            
            {isUploading && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">Uploading & parsing document... {uploadProgress}%</Typography>
                <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 8, borderRadius: 2, mt: 1 }} />
              </Box>
            )}

            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={!selectedFile || isUploading}
              onClick={handleUpload}
              sx={{ mt: 3, py: 1.5, fontWeight: 700 }}
            >
              {isUploading ? 'Processing Extraction...' : 'Start AI Extraction'}
            </Button>
          </Paper>

          <Paper sx={{ p: 3, mt: 3, bgcolor: '#f8fafc' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="success" fontSize="small" /> Automated AI Pipeline
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Uploads are automatically processed with PyPDF OCR, LayoutLM field extraction, and SpaCy named entity recognition to build structured invoice data.
            </Typography>
          </Paper>
        </Grid>

        {/* Extraction Results Column */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 3.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Extraction Results</Typography>
                <Typography variant="body2" color="text.secondary">
                  Structured records parsed from uploaded invoice documents.
                </Typography>
              </Box>
              <Button variant="outlined" size="small" onClick={() => navigate(ROUTES.HISTORY)}>
                View Repository
              </Button>
            </Stack>

            {loadingExtractions ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : extractions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
                <ReceiptIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>No Extracted Invoices Yet</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2 }}>
                  Upload a PDF or invoice file on the left to extract metadata.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {extractions.map((item) => (
                  <Card key={item.id} variant="outlined" sx={{ borderRadius: 3, transition: 'all 0.2s ease', '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.06)' } }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={7}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                            {item.vendor_name || `Invoice #${item.invoice_id}`}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 0.8 }}>
                            <Chip label={`Invoice #: ${item.invoice_number || 'N/A'}`} size="small" variant="outlined" />
                            <Chip label={`Date: ${item.invoice_date || 'N/A'}`} size="small" variant="outlined" />
                          </Stack>
                        </Grid>

                        <Grid item xs={12} sm={5}>
                          <Stack alignItems={{ xs: 'flex-start', sm: 'flex-end' }} spacing={1}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#4f46e5' }}>
                              {item.currency || '$'}{item.total_amount || '0.00'}
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="View Document File">
                                <Button
                                  variant="contained"
                                  size="small"
                                  color="primary"
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => handleOpenViewer(item.invoice_id, item.vendor_name)}
                                >
                                  View Invoice
                                </Button>
                              </Tooltip>
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Document Viewer Modal */}
      <Dialog open={viewerOpen} onClose={handleCloseViewer} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Viewing Document: {viewInvoiceName}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseViewer}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, height: '75vh', bgcolor: '#f1f5f9' }}>
          {viewInvoiceId ? (
            <iframe
              src={fileUrl}
              title="Invoice File Preview"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            component="a"
            href={fileUrl}
            target="_blank"
            download
          >
            Download Original File
          </Button>
          <Button variant="contained" onClick={handleCloseViewer}>
            Close Preview
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
