using AutoMapper;
using FoodAPI.Models.Models;
using FoodAPI.Models.Models.Dto;

namespace FoodAPI
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            CreateMap<SellerProfile, SellerProfileCreateDTO>().ReverseMap();
            CreateMap<SellerProfile, SellerProfileDTO>().ReverseMap();
            CreateMap<SellerProfile, SellerProfileAdminDTO>().ReverseMap();
            CreateMap<Category, CategoryCreateDTO>().ReverseMap();
            CreateMap<Category, CategoryDTO>().ReverseMap();
            CreateMap<Category, CategoryUpdateDTO>().ReverseMap();
            CreateMap<FoodItem, FoodItemDTO>().ReverseMap();
            CreateMap<FoodItem, FoodItemCreateDTO>().ReverseMap();
            CreateMap<ShoppingCart, ShoppingCartDTO>().ReverseMap();
            CreateMap<ShoppingCart, ShoppingCartAddDTO>().ReverseMap();
            CreateMap<OrderHeader, OrderHeaderCreateDTO>().ReverseMap();
            CreateMap<OrderDetail, OrderDetailDTO>().ReverseMap();
            CreateMap<OrderHeader, OrderHeaderDTO>()
                .ForMember(dest => dest.RestaurantName, opt => opt.MapFrom(src => 
                    src.OrderDetails.Any() && src.OrderDetails.First().FoodItem != null && src.OrderDetails.First().FoodItem.SellerProfile != null
                    ? src.OrderDetails.First().FoodItem.SellerProfile.Name 
                    : "Yeti Food"))
                .ReverseMap();
        }
    }
}
