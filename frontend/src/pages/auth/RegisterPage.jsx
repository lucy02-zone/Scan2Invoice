import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, TextField, Typography, Link, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';

import { useAuth } from '../../contexts/AuthContext.jsx';
import { registerUser } from '../../api/auth.js';
import { ROUTES } from '../../utils/constants.js';

export function RegisterPage() {
  const { register, handleSubmit, watch, formState } = useForm();
  const { errors } = formState;
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const password = watch('password', '');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (values) => {
    setApiError(null);
    setIsLoading(true);

    try {
      await registerUser({
        full_name: values.fullName,
        email: values.email,
        password: values.password
      });
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      setApiError(error.response?.data?.detail || 'Unable to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', p: 2 }}>
      <Card sx={{ width: 420, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Register to begin automating invoice capture and extraction.
          </Typography>
          {apiError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Full name"
              fullWidth
              margin="normal"
              {...register('fullName', { required: 'Full name is required' })}
              error={Boolean(errors.fullName)}
              helperText={errors.fullName?.message}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address'
                }
              })}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' }
              })}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
            <TextField
              label="Confirm password"
              type="password"
              fullWidth
              margin="normal"
              {...register('confirmPassword', {
                required: 'Confirm password is required',
                validate: (value) => value === password || 'Passwords do not match'
              })}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
            />
            <LoadingButton type="submit" fullWidth variant="contained" loading={isLoading} sx={{ mt: 2 }}>
              Register
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Link component={RouterLink} to={ROUTES.LOGIN} variant="body2">
              Already have an account?
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
