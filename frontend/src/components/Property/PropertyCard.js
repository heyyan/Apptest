import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Grid,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Bed,
  Bathtub,
  DirectionsCar,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../config/api';

const PropertyCard = ({ property, onFavoriteChange }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(property.isFavorite);
  const [loading, setLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/favorites/${property.id}`);
      setIsFavorite(response.data.isFavorite);
      onFavoriteChange?.(property.id, response.data.isFavorite);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price, listingType) => {
    const formattedPrice = new Intl.NumberFormat('en-US').format(price);
    return listingType === 'Rent' 
      ? `${formattedPrice}/month`
      : `${formattedPrice}`;
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: 'pointer', 
        position: 'relative',
        '&:hover': { transform: 'translateY(-4px)' }
      }}
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={property.imageUrls?.[0] || 'https://via.placeholder.com/400x200'}
        alt={property.title}
      />
      
      {isAuthenticated && (
        <IconButton
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
          }}
          onClick={handleFavoriteClick}
          disabled={loading}
        >
          {isFavorite ? (
            <Favorite sx={{ color: 'error.main' }} />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
      )}
      
      <CardContent>
        <Typography variant="h6" gutterBottom noWrap>
          {property.title}
        </Typography>
        
        <Box display="flex" alignItems="center" mb={1}>
          <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {property.suburb}, {property.city}
          </Typography>
        </Box>
        
        <Typography variant="h5" color="primary" gutterBottom>
          {formatPrice(property.price, property.listingType)}
        </Typography>
        
        <Box mb={2}>
          <Chip
            size="small"
            label={property.listingType}
            color={property.listingType === 'Sale' ? 'primary' : 'secondary'}
            variant="outlined"
          />
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Bed fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{property.bedrooms}</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Bathtub fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{property.bathrooms}</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <DirectionsCar fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2">{property.carSpots}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;