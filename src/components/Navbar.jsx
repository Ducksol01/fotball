import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar = ({ mode, toggleMode }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: mode === 'light' ? '#1a237e' : '#283593' }}>
      <Toolbar>
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
          <SportsSoccerIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Football Live
          </Typography>
        </Box>
        <Box sx={{ marginLeft: 'auto' }}>
          <Button color="inherit" component={Link} to="/">
            Live Matches
          </Button>
          <Button color="inherit" component={Link} to="/schedule">
            Schedule
          </Button>
          <Button color="inherit" component={Link} to="/teams">
            Teams
          </Button>
          <Button color="inherit" component={Link} to="/admin">
            Admin
          </Button>
        </Box>
        <IconButton color="inherit" onClick={toggleMode} sx={{ ml: 1 }}>
          {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;