import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Button,
} from '@mui/material';
import { Favorite, Home } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/Property/PropertyCard';
import api from '../config/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await api.get('/favorites');
        // Ensure all favorites have isFavorite = true
        const favoritesWithFlag = response.data.map(property => ({
          ...property,
          isFavorite: true,
        }));
        setFavorites(favoritesWithFlag);
      } catch (err) {
        setError('Failed to load favorites');
        console.error('Fetch favorites error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleFavoriteChange = (propertyId, isFavorite) => {
    if (!isFavorite) {
      // Remove from favorites list when unfavorited
      setFavorites(prev => prev.filter(property => property.id !== propertyId));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        My Favorite Properties
      </Typography>

      {favorites.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', mt: 4 }}>
          <Favorite sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No favorite properties yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start browsing properties and click the heart icon to save them here!
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/"
            startIcon={<Home />}
            size="large"
          >
            Browse Properties
          </Button>
        </Paper>
      ) : (
        <>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {favorites.length} favorite {favorites.length === 1 ? 'property' : 'properties'}
          </Typography>
          
          <Grid container spacing={3} mt={1}>
            {favorites.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property.id}>
                <PropertyCard 
                  property={property}
                  onFavoriteChange={handleFavoriteChange}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Favorites;