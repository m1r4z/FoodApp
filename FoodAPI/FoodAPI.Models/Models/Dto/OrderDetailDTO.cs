using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FoodAPI.Models.Models.Dto
{
    public class OrderDetailDTO
    {
        public int FoodItemId { get; set; }
        public FoodItemDTO FoodItem { get; set; }
        public int Count { get; set; }
        public double? Price { get; set; }
    }
}
