import api from '../services/api.js';

export function processInvoice(file, onUploadProgress) {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress,
  });
}

export function getInvoices(params = {}) {
  return api.get('/invoices', { params });
}

export function getInvoiceById(id) {
  return api.get(`/invoices/${id}`);
}

export function getExtractions(params = {}) {
  return api.get('/extractions', { params });
}

export function getExtractionByInvoiceId(invoiceId) {
  return api.get(`/extractions/${invoiceId}`);
}

export function getDashboardStats() {
  return api.get('/dashboard/stats');
}

export function getInvoiceFileUrl(invoiceId) {
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  return `${baseURL}/api/v1/invoices/${invoiceId}/file`;
}
