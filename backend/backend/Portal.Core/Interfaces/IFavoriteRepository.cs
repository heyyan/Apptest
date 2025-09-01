using Portal.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portal.Core.Interfaces
{
    public interface IFavoriteRepository
    {
        Task<IEnumerable<Favorite>> GetUserFavoritesAsync(int userId);
        Task<Favorite?> GetFavoriteAsync(int userId, int propertyId);
        Task AddFavoriteAsync(Favorite favorite);
        Task RemoveFavoriteAsync(Favorite favorite);
        Task<bool> IsPropertyFavoriteAsync(int userId, int propertyId);
    }
}
