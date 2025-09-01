using AutoMapper;
using Portal.Core.DTOs;
using Portal.Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portal.Core.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _propertyRepository;
        private readonly IFavoriteRepository _favoriteRepository;
        private readonly IMapper _mapper;

        public PropertyService(IPropertyRepository propertyRepository, IFavoriteRepository favoriteRepository, IMapper mapper)
        {
            _propertyRepository = propertyRepository;
            _favoriteRepository = favoriteRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PropertyDto>> GetPropertiesAsync(PropertyFilterDto filter, int? userId = null)
        {
            var properties = await _propertyRepository.GetAllAsync(filter);
            var propertyDtos = _mapper.Map<IEnumerable<PropertyDto>>(properties);

            if (userId.HasValue)
            {
                foreach (var property in propertyDtos)
                {
                    property.IsFavorite = await _favoriteRepository.IsPropertyFavoriteAsync(userId.Value, property.Id);
                }
            }

            return propertyDtos;
        }

        public async Task<PropertyDto?> GetPropertyByIdAsync(int id, int? userId = null)
        {
            var property = await _propertyRepository.GetByIdAsync(id);
            if (property == null) return null;

            var propertyDto = _mapper.Map<PropertyDto>(property);

            if (userId.HasValue)
            {
                propertyDto.IsFavorite = await _favoriteRepository.IsPropertyFavoriteAsync(userId.Value, id);
            }

            return propertyDto;
        }

        public async Task<int> GetPropertiesCountAsync(PropertyFilterDto filter)
        {
            return await _propertyRepository.CountAsync(filter);
        }
    }
}
