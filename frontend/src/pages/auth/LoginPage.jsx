import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, TextField, Typography, Link } from '@mui/material';
import { useForm } from 'react-hook-form';

export function LoginPage() {
  const { register, handleSubmit, formState } = useForm();

  const onSubmit = (values) => {
    console.log('login values', values);
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
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('email', { required: 'Email is required' })}
              label="Email"
              fullWidth
              margin="normal"
              type="email"
            />
            <TextField
              {...register('password', { required: 'Password is required' })}
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
