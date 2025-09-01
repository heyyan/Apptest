using Portal.Core.DTOs;
using Portal.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portal.Core.Interfaces
{
    public interface IPropertyRepository
    {
        Task<IEnumerable<Property>> GetAllAsync(PropertyFilterDto filter);
        Task<Property?> GetByIdAsync(int id);
        Task<int> CountAsync(PropertyFilterDto filter);
    }
}
