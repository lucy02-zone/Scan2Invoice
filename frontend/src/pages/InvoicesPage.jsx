import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Input,
  LinearProgress
} from '@mui/material';

const extractionItems = [
  { id: 'INV-1004', vendor: 'North Star Media', amount: '$870.00', status: 'Processing' },
  { id: 'INV-1005', vendor: 'Atlas Hardware', amount: '$3,520.50', status: 'Completed' },
  { id: 'INV-1006', vendor: 'Summit Catering', amount: '$1,145.75', status: 'Review' }
];

function statusColor(status) {
  if (status === 'Completed') return 'success';
  if (status === 'Processing') return 'info';
  return 'warning';
}

export function InvoicesPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files?.[0] ?? null);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(10);

    const timer = setInterval(() => {
      setUploadProgress((current) => {
        const next = current + 20;
        if (next >= 100) {
          clearInterval(timer);
          setIsUploading(false);
          return 100;
        }
        return next;
      });
    }, 300);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Invoice management
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload new invoice
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Drop a scanned invoice or PDF file here and start AI extraction for line items, totals, and vendor details.
            </Typography>

            <Stack spacing={2}>
              <Input
                type="file"
                inputProps={{ accept: '.pdf,image/*' }}
                onChange={handleFileChange}
              />
              {selectedFile && (
                <Typography variant="body2">
                  Selected: {selectedFile.name}
                </Typography>
              )}
              {isUploading && <LinearProgress variant="determinate" value={uploadProgress} />}
              <Button
                variant="contained"
                disabled={!selectedFile || isUploading}
                onClick={handleUpload}
              >
                {isUploading ? 'Uploading…' : 'Upload invoice'}
              </Button>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload guidance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Supported formats: PDF, JPG, PNG.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The app will automatically detect invoice fields and route documents for review if confidence is low.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h6">Extraction results</Typography>
                <Typography variant="body2" color="text.secondary">
                  Track the latest invoice processing status and review items requiring attention.
                </Typography>
              </Box>
              <Button variant="outlined">View all invoices</Button>
            </Stack>

            <List>
              {extractionItems.map((invoice, index) => (
                <Box key={invoice.id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemText
                      primary={invoice.id}
                      secondary={`${invoice.vendor} • ${invoice.amount}`}
                    />
                    <Chip label={invoice.status} color={statusColor(invoice.status)} />
                  </ListItem>
                  {index < extractionItems.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
