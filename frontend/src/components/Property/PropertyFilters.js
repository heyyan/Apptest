import React from 'react';
import {
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';

const PropertyFilters = ({ filters, onFilterChange, onSearch, loading }) => {
  const handleInputChange = (field) => (event) => {
    onFilterChange({ ...filters, [field]: event.target.value });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Search Filters
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="City"
            value={filters.city || ''}
            onChange={handleInputChange('city')}
            size="small"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Suburb"
            value={filters.suburb || ''}
            onChange={handleInputChange('suburb')}
            size="small"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Listing Type</InputLabel>
            <Select
              value={filters.listingType || ''}
              label="Listing Type"
              onChange={handleInputChange('listingType')}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Sale">Sale</MenuItem>
              <MenuItem value="Rent">Rent</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Min Bedrooms</InputLabel>
            <Select
              value={filters.minBedrooms || ''}
              label="Min Bedrooms"
              onChange={handleInputChange('minBedrooms')}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="1">1+</MenuItem>
              <MenuItem value="2">2+</MenuItem>
              <MenuItem value="3">3+</MenuItem>
              <MenuItem value="4">4+</MenuItem>
              <MenuItem value="5">5+</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Min Price"
            type="number"
            value={filters.minPrice || ''}
            onChange={handleInputChange('minPrice')}
            size="small"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Max Price"
            type="number"
            value={filters.maxPrice || ''}
            onChange={handleInputChange('maxPrice')}
            size="small"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Min Bathrooms</InputLabel>
            <Select
              value={filters.minBathrooms || ''}
              label="Min Bathrooms"
              onChange={handleInputChange('minBathrooms')}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="1">1+</MenuItem>
              <MenuItem value="2">2+</MenuItem>
              <MenuItem value="3">3+</MenuItem>
              <MenuItem value="4">4+</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Search />}
            onClick={onSearch}
            disabled={loading}
            sx={{ height: '40px' }}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PropertyFilters;