using AutoMapper;
using Portal.Core.DTOs;
using Portal.Core.Entities;
using Portal.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portal.Core.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepository;
        private readonly IPropertyRepository _propertyRepository;
        private readonly IMapper _mapper;

        public FavoriteService(IFavoriteRepository favoriteRepository, IPropertyRepository propertyRepository, IMapper mapper)
        {
            _favoriteRepository = favoriteRepository;
            _propertyRepository = propertyRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PropertyDto>> GetUserFavoritesAsync(int userId)
        {
            var favorites = await _favoriteRepository.GetUserFavoritesAsync(userId);
            var properties = favorites.Select(f => f.Property);
            return _mapper.Map<IEnumerable<PropertyDto>>(properties);
        }

        public async Task<bool> ToggleFavoriteAsync(int userId, int propertyId)
        {
            var existingFavorite = await _favoriteRepository.GetFavoriteAsync(userId, propertyId);

            if (existingFavorite != null)
            {
                await _favoriteRepository.RemoveFavoriteAsync(existingFavorite);
                return false; // Removed from favorites
            }
            else
            {
                var favorite = new Favorite
                {
                    UserId = userId,
                    PropertyId = propertyId,
                    AddedAt = DateTime.UtcNow
                };
                await _favoriteRepository.AddFavoriteAsync(favorite);
                return true; // Added to favorites
            }
        }

        public async Task<bool> IsPropertyFavoriteAsync(int userId, int propertyId)
        {
            return await _favoriteRepository.IsPropertyFavoriteAsync(userId, propertyId);
        }
    }
}
