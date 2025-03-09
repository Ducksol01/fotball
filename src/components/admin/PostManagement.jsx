import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { matchService } from '../../services/matchService';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(matchService.getMatches());

    // Add event listener for match updates
    const handleMatchesUpdate = () => {
      setPosts(matchService.getMatches());
    };

    window.addEventListener(matchService.MATCHES_UPDATE_EVENT, handleMatchesUpdate);

    return () => {
      window.removeEventListener(matchService.MATCHES_UPDATE_EVENT, handleMatchesUpdate);
    };
  }, []);
  
  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    score: '',
    time: '',
    league: '',
    date: '',
    streamingLinks: [{ name: '', url: '', quality: '' }]
  });

  const handleOpen = (post = null) => {
    if (post) {
      setEditingPost(post);
      setFormData(post);
    } else {
      setEditingPost(null);
      setFormData({
        homeTeam: '',
        awayTeam: '',
        score: '',
        time: '',
        league: '',
        date: '',
        streamingLinks: [{ name: '', url: '', quality: '' }]
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPost(null);
  };

  const handleSave = (event) => {
    event.preventDefault();
    const postData = {
      ...formData,
      id: editingPost ? editingPost.id : Date.now()
    };

    if (editingPost) {
      matchService.updateMatch(postData);
    } else {
      matchService.addMatch(postData);
    }

    handleClose();
  };

  const handleDelete = (postId) => {
    matchService.deleteMatch(postId);
    setPosts(matchService.getMatches());
  };

  const handleStreamingLinkChange = (index, field, value) => {
    const newLinks = [...formData.streamingLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, streamingLinks: newLinks });
  };

  const addStreamingLink = () => {
    setFormData({
      ...formData,
      streamingLinks: [...formData.streamingLinks, { name: '', url: '', quality: '' }]
    });
  };

  const removeStreamingLink = (index) => {
    const newLinks = formData.streamingLinks.filter((_, i) => i !== index);
    setFormData({ ...formData, streamingLinks: newLinks });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Match Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Match
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Teams</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>League</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.homeTeam} vs {post.awayTeam}</TableCell>
                <TableCell>{post.score}</TableCell>
                <TableCell>{post.time}'</TableCell>
                <TableCell>{post.league}</TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(post)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(post.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPost ? 'Edit Match' : 'Add New Match'}
        </DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Home Team"
                  value={formData.homeTeam}
                  onChange={(e) => setFormData({ ...formData, homeTeam: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Away Team"
                  value={formData.awayTeam}
                  onChange={(e) => setFormData({ ...formData, awayTeam: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Score"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="League"
                  value={formData.league}
                  onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Streaming Links
                </Typography>
                {formData.streamingLinks.map((link, index) => (
                  <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Stream Name"
                          value={link.name}
                          onChange={(e) => handleStreamingLinkChange(index, 'name', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Stream URL"
                          value={link.url}
                          onChange={(e) => handleStreamingLinkChange(index, 'url', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Quality"
                          value={link.quality}
                          onChange={(e) => handleStreamingLinkChange(index, 'quality', e.target.value)}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton
                          onClick={() => removeStreamingLink(index)}
                          disabled={formData.streamingLinks.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={addStreamingLink}
                  sx={{ mt: 1 }}
                >
                  Add Streaming Link
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PostManagement;