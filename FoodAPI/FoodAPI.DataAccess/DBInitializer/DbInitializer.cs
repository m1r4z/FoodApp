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

            // Check if admin user already exists
            if (_userManager.FindByEmailAsync("admin@gmail.com").GetAwaiter().GetResult() != null)
            {
                return;
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

            // Create admin user
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

            return;
        }
    }
}
