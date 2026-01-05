using FoodAPI.DataAccess.Data;
using FoodAPI.Models.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using FoodAPI.Utility;

namespace FoodAPI.DataAccess.DBInitializer
{
    public class DbInitializer : IDbInitializer
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _db;

        public DbInitializer(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ApplicationDbContext db)
            // ReSharper disable once ConvertToPrimaryConstructor
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _db = db;
        }
        public void Initialize()
        {
            //migrations if they are not
            try
            {
                if (_db.Database.GetPendingMigrations().Any())
                {
                    _db.Database.Migrate();
                }
            }
            catch (Exception ex)
            {

            }

            // Create roles if they don't exist
            string[] roles = { SD.RoleAdmin, SD.RoleCustomer, SD.RoleDeliveryRider, SD.RoleIndividualSeller, SD.RoleRestaurantSeller };
            foreach (var role in roles)
            {
                if (!_roleManager.RoleExistsAsync(role).GetAwaiter().GetResult())
                {
                    _roleManager.CreateAsync(new IdentityRole { Name = role }).GetAwaiter().GetResult();
                }
            }

            // Create admin user if it doesn't exist
            if (_userManager.FindByEmailAsync("admin@gmail.com").GetAwaiter().GetResult() == null)
            {
                var adminUser = new ApplicationUser
                {
                    FullName = "Admin",
                    PhoneNumber = "1234567890",
                    Email = "admin@gmail.com",
                    UserName = "admin@gmail.com",
                    Address = "adminAddress"
                };

                var result = _userManager.CreateAsync(adminUser, "Admin123!").GetAwaiter().GetResult();
                if (result.Succeeded)
                {
                    _userManager.AddToRoleAsync(adminUser, SD.RoleAdmin).GetAwaiter().GetResult();
                }
            }

            // Create Riders if they don't exist
            var riders = new[]
            {
                new { Name = "Rider 1", Email = "rider1@gmail.com", Phone = "0987654321", Address = "Rider Location 1" },
                new { Name = "Rider 2", Email = "rider2@gmail.com", Phone = "0987654322", Address = "Rider Location 2" }
            };

            foreach (var r in riders)
            {
                if (_userManager.FindByEmailAsync(r.Email).GetAwaiter().GetResult() == null)
                {
                    var rider = new ApplicationUser
                    {
                        FullName = r.Name,
                        PhoneNumber = r.Phone,
                        Email = r.Email,
                        UserName = r.Email,
                        Address = r.Address
                    };
                    var result = _userManager.CreateAsync(rider, "Rider123!").GetAwaiter().GetResult();
                    if (result.Succeeded)
                    {
                        _userManager.AddToRoleAsync(rider, SD.RoleDeliveryRider).GetAwaiter().GetResult();
                    }
                }
            }

            // Create Buyers/Customers if they don't exist
            var buyers = new[]
            {
                new { Name = "Buyer 1", Email = "buyer1@gmail.com", Phone = "1112223331", Address = "Buyer Address 1" },
                new { Name = "Buyer 2", Email = "buyer2@gmail.com", Phone = "1112223332", Address = "Buyer Address 2" }
            };

            foreach (var b in buyers)
            {
                if (_userManager.FindByEmailAsync(b.Email).GetAwaiter().GetResult() == null)
                {
                    var buyer = new ApplicationUser
                    {
                        FullName = b.Name,
                        PhoneNumber = b.Phone,
                        Email = b.Email,
                        UserName = b.Email,
                        Address = b.Address
                    };
                    var result = _userManager.CreateAsync(buyer, "Buyer123!").GetAwaiter().GetResult();
                    if (result.Succeeded)
                    {
                        _userManager.AddToRoleAsync(buyer, SD.RoleCustomer).GetAwaiter().GetResult();
                    }
                }
            }

            // Create Restaurants, Profiles, Categories, and Food Items
            var restaurantData = new[]
            {
                new { Name = "Burger Palace", Email = "burger_palace@gmail.com", Address = "123 Burger St" },
                new { Name = "Pizza Hut", Email = "pizza_hut@gmail.com", Address = "456 Pizza Ave" }
            };

            foreach (var data in restaurantData)
            {
                var restaurantUser = _userManager.FindByEmailAsync(data.Email).GetAwaiter().GetResult();
                if (restaurantUser == null)
                {
                    restaurantUser = new ApplicationUser
                    {
                        FullName = data.Name,
                        PhoneNumber = "5556667777",
                        Email = data.Email,
                        UserName = data.Email,
                        Address = data.Address
                    };
                    var result = _userManager.CreateAsync(restaurantUser, "Restaurant123!").GetAwaiter().GetResult();
                    if (result.Succeeded)
                    {
                        _userManager.AddToRoleAsync(restaurantUser, SD.RoleRestaurantSeller).GetAwaiter().GetResult();
                    }
                    else
                    {
                        continue; // Skip if user creation failed
                    }
                }

                // Ensure Seller Profile exists
                var sellerProfile = _db.SellerProfiles.FirstOrDefault(u => u.ApplicationUserId == restaurantUser.Id);
                if (sellerProfile == null)
                {
                    sellerProfile = new SellerProfile
                    {
                        Name = data.Name,
                        Address = data.Address,
                        ApplicationUserId = restaurantUser.Id
                    };
                    _db.SellerProfiles.Add(sellerProfile);
                    _db.SaveChanges();
                }

                // Ensure Category exists for this restaurant
                var category = _db.Category.FirstOrDefault(c => c.CategoryName == "Main Course" && c.SellerProfileId == sellerProfile.Id);
                if (category == null)
                {
                    category = new Category
                    {
                        CategoryName = "Main Course",
                        CategoryDescription = "Delicious main dishes",
                        SellerProfileId = sellerProfile.Id
                    };
                    _db.Category.Add(category);
                    _db.SaveChanges();
                }

                // Seed Food Items if they don't exist for this restaurant
                if (data.Name == "Burger Palace")
                {
                    var items = new[]
                    {
                        new { Name = "Classic Burger", Desc = "Juicy beef patty with cheese", Price = 9.99, Image = SD.Image1 },
                        new { Name = "Double Cheeseburger", Desc = "Two beef patties and extra cheese", Price = 12.99, Image = SD.Image2 }
                    };

                    foreach (var item in items)
                    {
                        if (!_db.FoodItems.Any(f => f.FoodName == item.Name && f.SellerProfileId == sellerProfile.Id))
                        {
                            _db.FoodItems.Add(new FoodItem
                            {
                                FoodName = item.Name,
                                FoodDescription = item.Desc,
                                FoodPrice = item.Price,
                                ImageUrl = item.Image,
                                SellerProfileId = sellerProfile.Id,
                                CategoryId = category.Id
                            });
                        }
                    }
                }
                else if (data.Name == "Pizza Hut")
                {
                    var items = new[]
                    {
                        new { Name = "Pepperoni Pizza", Desc = "Classic pepperoni and mozzarella", Price = 14.99, Image = SD.Image3 },
                        new { Name = "Veggie Delight", Desc = "Fresh vegetables and olives", Price = 13.99, Image = SD.Image4 }
                    };

                    foreach (var item in items)
                    {
                        if (!_db.FoodItems.Any(f => f.FoodName == item.Name && f.SellerProfileId == sellerProfile.Id))
                        {
                            _db.FoodItems.Add(new FoodItem
                            {
                                FoodName = item.Name,
                                FoodDescription = item.Desc,
                                FoodPrice = item.Price,
                                ImageUrl = item.Image,
                                SellerProfileId = sellerProfile.Id,
                                CategoryId = category.Id
                            });
                        }
                    }
                }
                _db.SaveChanges();
            }

            return;
        }
    }
}
