using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portal.Core.Interfaces;
using System.Security.Claims;

namespace Portal.Controllers
{
    [ApiController]
    [Route("api/favorites")]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoritesController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var favorites = await _favoriteService.GetUserFavoritesAsync(userId);
            return Ok(favorites);
        }

        [HttpPost("{propertyId}")]
        public async Task<IActionResult> ToggleFavorite(int propertyId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var isFavorite = await _favoriteService.ToggleFavoriteAsync(userId, propertyId);

            return Ok(new { IsFavorite = isFavorite });
        }
    }
}
