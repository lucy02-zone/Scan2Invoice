import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Typography, Link, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';

import { forgotPasswordUser } from '../../api/auth.js';
import { ROUTES } from '../../utils/constants.js';

export function ForgotPasswordPage() {
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;
  const [apiMessage, setApiMessage] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values) => {
    setApiError(null);
    setApiMessage(null);
    setIsLoading(true);

    try {
      await forgotPasswordUser({ email: values.email });
      setApiMessage('If your email exists, a password reset link was sent.');
    } catch (error) {
      setApiError(error.response?.data?.detail || 'Unable to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', p: 2 }}>
      <Card sx={{ width: 420, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your email and we will send you instructions to reset your password.
          </Typography>
          {apiMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {apiMessage}
            </Alert>
          )}
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
            <LoadingButton type="submit" fullWidth variant="contained" loading={isLoading} sx={{ mt: 2 }}>
              Send reset link
            </LoadingButton>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Link component={RouterLink} to={ROUTES.LOGIN} variant="body2">
              Back to login
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
