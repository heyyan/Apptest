using Microsoft.AspNetCore.Mvc;
using Portal.Core.DTOs;
using Portal.Core.Interfaces;
using Portal.Core.Services;
using System.Security.Claims;

namespace Portal.Controllers
{
    [ApiController]
    [Route("api/properties")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;

        public PropertiesController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProperties([FromQuery] PropertyFilterDto filter)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int? userIdInt = userId != null ? int.Parse(userId) : null;

            var properties = await _propertyService.GetPropertiesAsync(filter, userIdInt);
            var totalCount = await _propertyService.GetPropertiesCountAsync(filter);

            return Ok(new
            {
                Properties = properties,
                TotalCount = totalCount,
                CurrentPage = filter.Page,
                TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProperty(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int? userIdInt = userId != null ? int.Parse(userId) : null;

            var property = await _propertyService.GetPropertyByIdAsync(id, userIdInt);
            if (property == null) return NotFound();

            return Ok(property);
        }
    }
}
