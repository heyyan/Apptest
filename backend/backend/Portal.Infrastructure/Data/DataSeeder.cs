using Portal.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Portal.Infrastructure.Data
{
    public static class DataSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            if (!context.Properties.Any())
            {
                var properties = new List<Property>
            {
                new Property
                {
                    Title = "Modern Apartment in CBD",
                    Address = "123 Main St",
                    Suburb = "CBD",
                    City = "Melbourne",
                    Price = 750000,
                    ListingType = ListingType.Sale,
                    Bedrooms = 2,
                    Bathrooms = 2,
                    CarSpots = 1,
                    Description = "Beautiful modern apartment in the heart of the city",
                    ImageUrls = new List<string> { "https://example.com/image1.jpg", "https://example.com/image2.jpg" }
                },
                new Property
                {
                    Title = "Family House in Suburbia",
                    Address = "456 Oak Ave",
                    Suburb = "Richmond",
                    City = "Melbourne",
                    Price = 1200000,
                    ListingType = ListingType.Sale,
                    Bedrooms = 4,
                    Bathrooms = 3,
                    CarSpots = 2,
                    Description = "Spacious family home with garden",
                    ImageUrls = new List<string> { "https://example.com/image3.jpg" }
                }
            };

                context.Properties.AddRange(properties);
                context.SaveChanges();
            }
        }
    }
}
