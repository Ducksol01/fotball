import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Grid, Card, CardContent, Divider, List, ListItem, ListItemText } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import StreamingLink from './StreamingLink';
import { matchService } from '../services/matchService';

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState(null);

  useEffect(() => {
    const fetchMatchDetails = () => {
      const matches = matchService.getMatches();
      const match = matches.find(m => m.id === parseInt(id));
      if (match) {
        setMatchDetails(match);
      } else {
        console.error('Match not found');
        navigate('/');
      }
    };

    fetchMatchDetails();

    const handleMatchesUpdate = () => {
      console.log('Matches updated event received');
      fetchMatchDetails();
    };

    window.addEventListener(matchService.MATCHES_UPDATE_EVENT, handleMatchesUpdate);

    return () => {
      window.removeEventListener(matchService.MATCHES_UPDATE_EVENT, handleMatchesUpdate);
    };
  }, [id, navigate]);

  if (!matchDetails) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{
        mt: 16,
        mb: 16,
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(255,255,255,0.4))',
        backdropFilter: 'blur(16px)',
        borderRadius: 4,
        boxShadow: 24,
        p: 8
      }}>
      <Card sx={{
        mb: 8,
        background: 'linear-gradient(to right, #1a237e, #3949ab)',
        color: 'white',
        transform: 'scale(1)',
        transition: 'all 0.3s ease-out',
        boxShadow: 8,
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 16
        }
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 3 }}>
            <Typography variant="h4" sx={{ mr: 2 }}>{matchDetails.homeTeam}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{matchDetails.score}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <SportsSoccerIcon sx={{ mr: 1 }} />
                <Typography>{matchDetails.time}'</Typography>
              </Box>
            </Box>
            <Typography variant="h4" sx={{ ml: 2 }}>{matchDetails.awayTeam}</Typography>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={4} sx={{ position: 'relative' }}>
        <Grid item xs={12} md={8}>
          <Card sx={{
            transform: 'translateY(0)',
            transition: 'all 0.3s ease-out',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            boxShadow: 8,
            '&:hover': {
              transform: 'translateY(-10px)',
              boxShadow: 16
            }
          }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ color: '#1a237e', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <LiveTvIcon sx={{ mr: 1 }} /> Streaming Links
              </Typography>
              <List>
                {matchDetails.streamingLinks && matchDetails.streamingLinks.map((link) => (
                  <ListItem key={link.id} divider>
                    <ListItemText
                      primary={link.name}
                      secondary={`Quality: ${link.quality}`}
                    />
                    <StreamingLink
                      url={link.url}
                      quality={link.quality}
                      name={link.name}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {matchDetails.stats && (
            <Card sx={{ mt: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                  Match Statistics
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {Object.entries(matchDetails.stats).map(([stat, values]) => (
                    <Box key={stat} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography>{values.home}%</Typography>
                        <Typography sx={{ textTransform: 'capitalize' }}>{stat}</Typography>
                        <Typography>{values.away}%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', height: 8, backgroundColor: '#e0e0e0' }}>
                        <Box sx={{ width: `${values.home}%`, backgroundColor: '#1a237e' }} />
                        <Box sx={{ width: `${values.away}%`, backgroundColor: '#9fa8da' }} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                Match Info
              </Typography>
              <List>
                <ListItem divider>
                  <ListItemText primary="League" secondary={matchDetails.league} />
                </ListItem>
                <ListItem divider>
                  <ListItemText primary="Stadium" secondary={matchDetails.stadium} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Date" secondary={matchDetails.date} />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {matchDetails.lineups && (
            <Card sx={{ mt: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ color: '#1a237e', fontWeight: 'bold' }}>
                  Lineups
                </Typography>
                <Typography variant="h6" gutterBottom>{matchDetails.homeTeam}</Typography>
                <List dense>
                  {matchDetails.lineups.home.map((player, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={player} />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>{matchDetails.awayTeam}</Typography>
                <List dense>
                  {matchDetails.lineups.away.map((player, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={player} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MatchDetails;