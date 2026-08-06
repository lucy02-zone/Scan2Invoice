import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, TextField, Typography, Link, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';

import { useAuth } from '../../contexts/AuthContext.jsx';
import { loginUser } from '../../api/auth.js';

export function LoginPage() {
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (values) => {
    setApiError(null);

    try {
      const response = await loginUser(values);
      const { token, user } = response.data;
      login(token, user || { email: values.email });
      navigate('/', { replace: true });
    } catch (error) {
      setApiError(error.response?.data?.detail || 'Unable to sign in. Check your credentials.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card sx={{ width: 420, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Login to Scan2Invoice
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your credentials to access the invoice automation dashboard.
          </Typography>
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('email', { required: 'Email is required' })}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              label="Email"
              fullWidth
              margin="normal"
              type="email"
            />
            <TextField
              {...register('password', { required: 'Password is required' })}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              label="Password"
              fullWidth
              margin="normal"
              type="password"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Sign in
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Forgot password?
            </Link>
            <Link component={RouterLink} to="/register" variant="body2">
              Create account
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
