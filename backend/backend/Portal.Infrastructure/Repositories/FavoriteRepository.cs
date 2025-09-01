using Microsoft.EntityFrameworkCore;
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
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly ApplicationDbContext _context;

        public FavoriteRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Favorite>> GetUserFavoritesAsync(int userId)
        {
            return await _context.Favorites
                .Include(f => f.Property)
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.AddedAt)
                .ToListAsync();
        }

        public async Task<Favorite?> GetFavoriteAsync(int userId, int propertyId)
        {
            return await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.PropertyId == propertyId);
        }

        public async Task AddFavoriteAsync(Favorite favorite)
        {
            await _context.Favorites.AddAsync(favorite);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveFavoriteAsync(Favorite favorite)
        {
            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsPropertyFavoriteAsync(int userId, int propertyId)
        {
            return await _context.Favorites
                .AnyAsync(f => f.UserId == userId && f.PropertyId == propertyId);
        }
    }
}
