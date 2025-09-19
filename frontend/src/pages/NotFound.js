import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      <Card sx={{ maxWidth: 500, textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: '6rem',
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 2,
            }}
          >
            404
          </Typography>
          
          <Typography variant="h4" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          
          <Typography variant="body1" color="textSecondary" paragraph>
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or you entered the wrong URL.
          </Typography>

          <Box display="flex" gap={2} justifyContent="center" mt={3}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/tasks')}
            >
              Go Home
            </Button>
          </Box>

          <Box mt={4}>
            <Typography variant="body2" color="textSecondary">
              If you think this is an error, please contact support.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotFound;
