using Microsoft.EntityFrameworkCore;
using Portal.Core.DTOs;
using Portal.Core.Entities;
using Portal.Core.Interfaces;
using Portal.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portal.Infrastructure.Repositories
{
    public class PropertyRepository : IPropertyRepository
    {
        private readonly ApplicationDbContext _context;

        public PropertyRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Property>> GetAllAsync(PropertyFilterDto filter)
        {
            var query = _context.Properties.AsQueryable();

            if (filter.MinPrice.HasValue)
                query = query.Where(p => p.Price >= filter.MinPrice.Value);
            if (filter.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= filter.MaxPrice.Value);
            if (filter.MinBedrooms.HasValue)
                query = query.Where(p => p.Bedrooms >= filter.MinBedrooms.Value);
            if (filter.MaxBedrooms.HasValue)
                query = query.Where(p => p.Bedrooms <= filter.MaxBedrooms.Value);
            if (filter.MinBathrooms.HasValue)
                query = query.Where(p => p.Bathrooms >= filter.MinBathrooms.Value);
            if (!string.IsNullOrEmpty(filter.Suburb))
                query = query.Where(p => p.Suburb.Contains(filter.Suburb));
            if (!string.IsNullOrEmpty(filter.City))
                query = query.Where(p => p.City.Contains(filter.City));
            if (!string.IsNullOrEmpty(filter.ListingType))
                query = query.Where(p => p.ListingType.ToString() == filter.ListingType);

            return await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();
        }

        public async Task<Property?> GetByIdAsync(int id)
        {
            return await _context.Properties.FindAsync(id);
        }

        public async Task<int> CountAsync(PropertyFilterDto filter)
        {
            var query = _context.Properties.AsQueryable();

            if (filter.MinPrice.HasValue)
                query = query.Where(p => p.Price >= filter.MinPrice.Value);
            if (filter.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= filter.MaxPrice.Value);
            if (filter.MinBedrooms.HasValue)
                query = query.Where(p => p.Bedrooms >= filter.MinBedrooms.Value);
            if (filter.MaxBedrooms.HasValue)
                query = query.Where(p => p.Bedrooms <= filter.MaxBedrooms.Value);
            if (filter.MinBathrooms.HasValue)
                query = query.Where(p => p.Bathrooms >= filter.MinBathrooms.Value);
            if (!string.IsNullOrEmpty(filter.Suburb))
                query = query.Where(p => p.Suburb.Contains(filter.Suburb));
            if (!string.IsNullOrEmpty(filter.City))
                query = query.Where(p => p.City.Contains(filter.City));
            if (!string.IsNullOrEmpty(filter.ListingType))
                query = query.Where(p => p.ListingType.ToString() == filter.ListingType);

            return await query.CountAsync();
        }
    }
}
