import { Box, Typography, Link } from '@mui/material';

export function AppFooter() {
  return (
    <Box component="footer" sx={{ py: 3, textAlign: 'center', color: 'text.secondary' }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} Scan2Invoice. Built for secure invoice automation.
      </Typography>
      <Link href="https://www.scan2invoice.example" target="_blank" rel="noopener noreferrer" underline="hover">
        Learn more
      </Link>
    </Box>
  );
}
