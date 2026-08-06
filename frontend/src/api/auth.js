import api from '../services/api.js';

export function loginUser(credentials) {
  return api.post('/auth/login', credentials);
}

export function registerUser(payload) {
  return api.post('/auth/register', payload);
}
