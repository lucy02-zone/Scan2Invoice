import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, TextField, Typography, Link } from '@mui/material';
import { useForm } from 'react-hook-form';

export function RegisterPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (values) => {
    console.log('register values', values);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card sx={{ width: 420, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Register to begin automating invoice capture and extraction.
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField {...register('fullName')} label="Full name" fullWidth margin="normal" />
            <TextField {...register('email')} label="Email" fullWidth margin="normal" type="email" />
            <TextField {...register('password')} label="Password" fullWidth margin="normal" type="password" />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Register
            </Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account?
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
