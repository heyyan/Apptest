using AutoMapper;
using Portal.Core.DTOs;
using Portal.Core.Entities;

namespace Portal.Core.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Property, PropertyDto>()
                .ForMember(dest => dest.ListingType, opt => opt.MapFrom(src => src.ListingType.ToString()));

            CreateMap<User, UserDto>();
        }
    }
}
