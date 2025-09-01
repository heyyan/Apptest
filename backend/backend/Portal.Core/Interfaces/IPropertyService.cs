using Portal.Core.DTOs;

namespace Portal.Core.Interfaces
{
    public interface IPropertyService
    {
        Task<IEnumerable<PropertyDto>> GetPropertiesAsync(PropertyFilterDto filter, int? userId = null);
        Task<PropertyDto?> GetPropertyByIdAsync(int id, int? userId = null);
        Task<int> GetPropertiesCountAsync(PropertyFilterDto filter);
    }
}
