import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, TextField, Typography, Link } from '@mui/material';
import { useForm } from 'react-hook-form';

export function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (values) => {
    console.log('forgot password values', values);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card sx={{ width: 420, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter your email and we will send you instructions to reset your password.
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField {...register('email')} label="Email" fullWidth margin="normal" type="email" />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Send reset link
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Back to login
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
