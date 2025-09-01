import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Pagination,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import PropertyCard from '../components/Property/PropertyCard';
import PropertyFilters from '../components/Property/PropertyFilters';
import api from '../config/api';

const PropertySearch = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 9,
  });
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const searchProperties = async (newFilters = filters) => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/properties?${params}`);
      setProperties(response.data.properties);
      setPagination({
        totalCount: response.data.totalCount,
        totalPages: response.data.totalPages,
        currentPage: response.data.page,
      });
    } catch (err) {
      setError('Failed to load properties. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchProperties();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleSearch = () => {
    const searchFilters = { ...filters, page: 1 };
    setFilters(searchFilters);
    searchProperties(searchFilters);
  };

  const handlePageChange = (event, page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    searchProperties(newFilters);
    window.scrollTo(0, 0);
  };

  const handleFavoriteChange = (propertyId, isFavorite) => {
    setProperties(prev =>
      prev.map(property =>
        property.id === propertyId
          ? { ...property, isFavorite }
          : property
      )
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Find Your Perfect Property
      </Typography>

      <PropertyFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        loading={loading}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {properties.length > 0 ? (
            <>
              <Typography variant="h6" gutterBottom>
                {pagination.totalCount} properties found
              </Typography>
              
              <Grid container spacing={3}>
                {properties.map((property) => (
                  <Grid item xs={12} sm={6} md={4} key={property.id}>
                    <PropertyCard 
                      property={property}
                      onFavoriteChange={handleFavoriteChange}
                    />
                  </Grid>
                ))}
              </Grid>

              {pagination.totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={pagination.totalPages}
                    page={pagination.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          ) : (
            <Box textAlign="center" py={6}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No properties found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search filters
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PropertySearch;