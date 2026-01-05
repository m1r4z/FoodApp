---
description: How to run the FoodAPI
---

# Running the FoodAPI

This workflow guides you through running the FoodAPI backend server.

## Prerequisites (One-time Setup)

### 1. Install .NET 8.0 SDK

Download and install the .NET 8.0 SDK for Mac:
```bash
# Visit https://dotnet.microsoft.com/download/dotnet/8.0
# Or install via Homebrew:
brew install --cask dotnet-sdk
```

Verify installation:
```bash
dotnet --version
```

### 2. Install SQL Server

For Mac, you have several options:

**Option A: Use SQL Server in Docker (Recommended for Mac)**
```bash
# Pull SQL Server image
docker pull mcr.microsoft.com/mssql/server:2022-latest

# Run SQL Server container
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Password123" \
  -p 1433:1433 --name sqlserver2022 \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

**Option B: Use Azure SQL Database (Cloud-based)**
- Create a free Azure account
- Set up an Azure SQL Database
- Update connection string accordingly

**Option C: Remote SQL Server**
- Connect to a remote Windows machine running SQL Server

### 3. Update Database Connection String

Edit `/Users/haider/Git/FoodApp/FoodAPI/FoodAPI/appsettings.json`:

For Docker SQL Server:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost,1433;Database=FoodApp;User Id=sa;Password=YourStrong@Password123;TrustServerCertificate=True"
}
```

Or create `appsettings.Development.json` to override settings locally (recommended):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=FoodApp;User Id=sa;Password=YourStrong@Password123;TrustServerCertificate=True"
  }
}
```

## Running the API

### Step 1: Navigate to FoodAPI directory
```bash
cd /Users/haider/Git/FoodApp/FoodAPI
```

### Step 2: Restore NuGet packages
// turbo
```bash
dotnet restore
```

### Step 3: Apply database migrations
```bash
dotnet ef database update --project FoodAPI
```

If you don't have EF tools installed:
```bash
dotnet tool install --global dotnet-ef
```

### Step 4: Run the API
// turbo
```bash
dotnet run --project FoodAPI
```

Alternatively, navigate into the project:
```bash
cd FoodAPI
dotnet run
```

### Step 5: Access the API

Once running, the API will be available at:
- **Swagger UI**: https://localhost:7041/swagger
- **API Base URL**: https://localhost:7041

The exact port will be displayed in the console output.

## Troubleshooting

### Database Connection Issues
- Ensure SQL Server is running (check Docker container: `docker ps`)
- Verify connection string is correct
- Check firewall settings

### Migration Issues
```bash
# List all migrations
dotnet ef migrations list --project FoodAPI

# Remove last migration (if needed)
dotnet ef migrations remove --project FoodAPI

# Add new migration
dotnet ef migrations add MigrationName --project FoodAPI
```

### Port Already in Use
If port 7041 is already in use, you can specify a different port:
```bash
dotnet run --project FoodAPI --urls "https://localhost:7043;http://localhost:5003"
```

## Quick Start (After Initial Setup)

1. Start SQL Server (if using Docker):
   ```bash
   docker start sqlserver2022
   ```

2. Run the API:
   ```bash
   cd /Users/haider/Git/FoodApp/FoodAPI
   dotnet run --project FoodAPI
   ```

## Existing Migrations

The project has the following migrations already created:
- `20240408151838_Initial` - Initial database schema
- `20240408155146_AddAutoGenerateShoopingcartId` - Shopping cart auto-generation
- `20240409141241_AddOrerHeaderAndDetailsToDb` - Order management tables

You just need to apply them with `dotnet ef database update`.
