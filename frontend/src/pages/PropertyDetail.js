import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Grid,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  LocationOn,
  Bed,
  Bathtub,
  DirectionsCar,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../config/api';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data);
      } catch (err) {
        setError('Property not found');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      const response = await api.post(`/favorites/${property.id}`);
      setProperty(prev => ({ ...prev, isFavorite: response.data.isFavorite }));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatPrice = (price, listingType) => {
    const formattedPrice = new Intl.NumberFormat('en-US').format(price);
    return listingType === 'Rent' 
      ? `${formattedPrice}/month`
      : `${formattedPrice}`;
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

  if (!property) {
    return (
      <Alert severity="error">
        Property not found
      </Alert>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Results
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={property.imageUrls?.[0] || 'https://via.placeholder.com/800x400'}
              alt={property.title}
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {property.title}
              </Typography>

              <Box display="flex" alignItems="center" mb={2}>
                <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="h6" color="text.secondary">
                  {property.address}, {property.suburb}, {property.city}
                </Typography>
              </Box>

              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                {property.description}
              </Typography>

              {property.imageUrls && property.imageUrls.length > 1 && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    More Photos
                  </Typography>
                  <ImageList sx={{ height: 300 }} cols={3} rowHeight={200}>
                    {property.imageUrls.slice(1).map((url, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={url}
                          alt={`${property.title} - ${index + 2}`}
                          loading="lazy"
                          style={{ borderRadius: 8 }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 100 }}>
            <CardContent>
              <Typography variant="h4" color="primary" gutterBottom>
                {formatPrice(property.price, property.listingType)}
              </Typography>

              <Chip
                label={property.listingType}
                color={property.listingType === 'Sale' ? 'primary' : 'secondary'}
                sx={{ mb: 3 }}
              />

              <Grid container spacing={2} mb={3}>
                <Grid item xs={4}>
                  <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={2}>
                    <Bed sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6">{property.bedrooms}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bedrooms
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={2}>
                    <Bathtub sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6">{property.bathrooms}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Bathrooms
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={2}>
                    <DirectionsCar sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6">{property.carSpots}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Car Spots
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {isAuthenticated && (
                <Button
                  fullWidth
                  variant={property.isFavorite ? "outlined" : "contained"}
                  startIcon={
                    favoriteLoading ? (
                      <CircularProgress size={20} />
                    ) : property.isFavorite ? (
                      <Favorite />
                    ) : (
                      <FavoriteBorder />
                    )
                  }
                  onClick={handleFavoriteToggle}
                  disabled={favoriteLoading}
                  size="large"
                  sx={{ mt: 2 }}
                >
                  {property.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyDetail;