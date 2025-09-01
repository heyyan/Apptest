using Portal.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portal.Core.Interfaces
{
    public interface IFavoriteService
    {
        Task<IEnumerable<PropertyDto>> GetUserFavoritesAsync(int userId);
        Task<bool> ToggleFavoriteAsync(int userId, int propertyId);
        Task<bool> IsPropertyFavoriteAsync(int userId, int propertyId);
    }
}
