import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchService } from '../services/matchService';
import { Container, Typography, Grid, Card, CardContent, Box, LinearProgress, IconButton } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const LiveMatches = () => {
  const navigate = useNavigate();
  const [liveMatches, setLiveMatches] = useState([]);

  useEffect(() => {
    const fetchLiveMatches = () => {
      try {
        const matches = matchService.getMatches();
        if (Array.isArray(matches)) {
          setLiveMatches(matches);
        } else {
          console.error('Invalid matches data format');
          setLiveMatches([]);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
        setLiveMatches([]);
      }
    };

    fetchLiveMatches();

    const handleMatchesUpdate = () => {
      console.log('Matches updated event received');
      fetchLiveMatches();
    };

    window.addEventListener(matchService.MATCHES_UPDATE_EVENT, handleMatchesUpdate);

    const interval = setInterval(fetchLiveMatches, 5000);

    return () => {
      clearInterval(interval);
      window.removeEventListener(matchService.MATCHES_UPDATE_EVENT, handleMatchesUpdate);
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{
        color: 'primary.main',
        fontWeight: 'bold',
        textAlign: 'center',
        mb: 6
      }}>
        Live Matches
      </Typography>
      <Grid container spacing={3}>
        {liveMatches.map((match) => (
          <Grid item xs={12} sm={6} md={4} key={match.id}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
              onClick={() => navigate(`/match/${match.id}`)}
            >
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {match.league}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ flex: 1 }}>
                    {match.homeTeam}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mx: 2,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    bgcolor: 'primary.main',
                    color: 'white'
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      {match.score}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ flex: 1, textAlign: 'right' }}>
                    {match.awayTeam}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SportsSoccerIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {match.time}'
                    </Typography>
                  </Box>
                  <IconButton size="small" color="primary">
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(parseInt(match.time) / 90) * 100} 
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LiveMatches;