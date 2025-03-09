import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useState } from 'react';

const StreamingLink = ({ url, quality, name }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);

    try {
      // Here you would typically validate the URL and check if it's accessible
      const isValidUrl = url && url.startsWith('http');
      
      if (!isValidUrl) {
        throw new Error('Invalid streaming URL');
      }

      // If URL is valid, redirect to the streaming page
      window.open(url, '_blank', 'noopener,noreferrer');
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClick}
        sx={{ backgroundColor: '#1a237e' }}
      >
        Watch Now
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ bgcolor: '#1a237e', color: 'white' }}>
          {name} - {quality}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, textAlign: 'center' }}>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Typography>Redirecting to stream...</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#1a237e' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StreamingLink;