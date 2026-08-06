import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, TextField, Typography, Link, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';

import { useAuth } from '../../contexts/AuthContext.jsx';
import { loginUser } from '../../api/auth.js';
import { ROUTES } from '../../utils/constants.js';

export function LoginPage() {
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values) => {
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await loginUser(values);
      // Backend may return `access_token` or `token` depending on implementation.
      const token = response.data?.token || response.data?.access_token;
      const user = response.data?.user || { email: values.email };
      if (!token) {
        throw new Error('Missing authentication token in response');
      }
      login(token, user);
      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      setApiError(error.response?.data?.detail || 'Unable to sign in. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', p: 2 }}>
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
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...register('email', { required: 'Email is required' })}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('password', { required: 'Password is required' })}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={isLoading}
              sx={{ mt: 2 }}
            >
              Sign in
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Link component={RouterLink} to={ROUTES.FORGOT_PASSWORD} variant="body2">
              Forgot password?
            </Link>
            <Link component={RouterLink} to={ROUTES.REGISTER} variant="body2">
              Create account
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
