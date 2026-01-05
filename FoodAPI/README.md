# FoodAPI - Quick Reference Guide

## 🎯 Quick Start (Recommended)

Simply run the automated setup script:

```bash
cd /Users/haider/Git/FoodApp/FoodAPI
./run-api.sh
```

This script will:
- ✅ Check if .NET is installed
- ✅ Start SQL Server (if using Docker)
- ✅ Restore packages
- ✅ Apply database migrations
- ✅ Run the API

## 📝 Database Configuration

### Your Current Setup Options:

You're on a Mac, so you have 3 options for SQL Server:

#### Option 1: Docker (Recommended) ⭐

**Install Docker Desktop:**
- Download from: https://www.docker.com/products/docker-desktop

**Create SQL Server container:**
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Password123" \
  -p 1433:1433 --name sqlserver2022 \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

**Connection String (already configured in appsettings.Development.json):**
```
Server=localhost,1433;Database=FoodApp;User Id=sa;Password=YourStrong@Password123;TrustServerCertificate=True
```

**Useful Docker Commands:**
```bash
# Start SQL Server
docker start sqlserver2022

# Stop SQL Server
docker stop sqlserver2022

# Check if running
docker ps

# View logs
docker logs sqlserver2022
```

#### Option 2: Azure SQL Database (Cloud)

1. Create a free Azure account
2. Create an Azure SQL Database
3. Update connection string in `appsettings.Development.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=tcp:yourserver.database.windows.net,1433;Database=FoodApp;User ID=yourusername;Password=yourpassword;Encrypt=True;TrustServerCertificate=False;"
}
```

#### Option 3: Remote Windows SQL Server

If you have access to a Windows machine with SQL Server:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=WINDOWS_IP_OR_HOSTNAME;Database=FoodApp;User Id=username;Password=password;TrustServerCertificate=True"
}
```

## 🔧 Prerequisites Installation

### Install .NET 8.0 SDK

**Option A - Download:**
https://dotnet.microsoft.com/download/dotnet/8.0

**Option B - Homebrew:**
```bash
brew install --cask dotnet-sdk
```

**Verify:**
```bash
dotnet --version
# Should show: 8.0.x
```

### Install EF Core Tools

```bash
dotnet tool install --global dotnet-ef
```

Add to your PATH (add to `~/.zshrc`):
```bash
export PATH="$PATH:$HOME/.dotnet/tools"
```

## 🚀 Manual Run Commands

If you prefer to run commands manually:

```bash
# 1. Navigate to project
cd /Users/haider/Git/FoodApp/FoodAPI

# 2. Restore packages
dotnet restore

# 3. Apply migrations
dotnet ef database update --project FoodAPI

# 4. Run the API
dotnet run --project FoodAPI
```

## 🌐 Access the API

Once running:
- **Swagger Documentation**: https://localhost:7041/swagger
- **API Base URL**: https://localhost:7041
- **Watch mode** (auto-reload): `dotnet watch --project FoodAPI`

## 📊 Database Migrations

The project has these existing migrations:
1. `20240408151838_Initial` - Initial schema
2. `20240408155146_AddAutoGenerateShoopingcartId` - Shopping cart
3. `20240409141241_AddOrerHeaderAndDetailsToDb` - Orders

### Migration Commands

```bash
# List all migrations
dotnet ef migrations list --project FoodAPI

# Apply migrations
dotnet ef database update --project FoodAPI

# Create new migration
dotnet ef migrations add MigrationName --project FoodAPI

# Remove last migration
dotnet ef migrations remove --project FoodAPI

# Reset database (caution!)
dotnet ef database drop --project FoodAPI
dotnet ef database update --project FoodAPI
```

## 🛠️ Troubleshooting

### Issue: "dotnet: command not found"
**Solution:** Install .NET SDK (see prerequisites above)

### Issue: "Unable to connect to database"
**Solutions:**
1. Check if SQL Server is running: `docker ps`
2. Start SQL Server: `docker start sqlserver2022`
3. Verify connection string in `appsettings.Development.json`
4. Check SQL Server logs: `docker logs sqlserver2022`

### Issue: "Port 7041 already in use"
**Solution:** Use different ports:
```bash
dotnet run --project FoodAPI --urls "https://localhost:7043;http://localhost:5003"
```

### Issue: "EF Core tools not found"
**Solution:**
```bash
dotnet tool install --global dotnet-ef
export PATH="$PATH:$HOME/.dotnet/tools"
```

### Issue: Migration fails
**Solution:**
```bash
# Drop and recreate database
dotnet ef database drop --project FoodAPI --force
dotnet ef database update --project FoodAPI
```

## 📂 Important Files

- **API Project**: `/Users/haider/Git/FoodApp/FoodAPI/FoodAPI/FoodAPI.csproj`
- **Connection String**: `/Users/haider/Git/FoodApp/FoodAPI/FoodAPI/appsettings.Development.json`
- **Migrations**: `/Users/haider/Git/FoodApp/FoodAPI/FoodAPI.DataAccess/Migrations/`
- **Setup Script**: `/Users/haider/Git/FoodApp/FoodAPI/run-api.sh`

## 🔐 Configured Services

The API uses these services (configured in appsettings.json):
- **Authentication**: JWT tokens
- **Email**: Gmail SMTP (yetaieats@gmail.com)
- **Image Storage**: Cloudinary
- **Payments**: Stripe

All credentials are already configured, but you may want to update them for production use.

## 💡 Tips

1. **Use the workflow**: Type `/run-api` in chat to get the workflow
2. **Development mode**: Uses `appsettings.Development.json` automatically
3. **Watch mode**: Use `dotnet watch` for auto-reload during development
4. **Database seeding**: Check `DBInitializer` folder for data seeding logic

## 🎬 Next Steps

After getting the API running:
1. Test endpoints using Swagger UI
2. Set up the React web frontend (YetiWeb)
3. Set up the React Native mobile app (YetiMobile)
4. Configure your own Cloudinary/Stripe/Email credentials

---

**Need help?** Just ask! You can also use the `/run-api` workflow command.
