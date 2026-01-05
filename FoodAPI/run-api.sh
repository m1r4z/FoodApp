#!/bin/bash

# FoodAPI Setup and Run Script
# This script helps you set up and run the FoodAPI on Mac

echo "🍔 FoodAPI Setup and Run Script"
echo "================================"
echo ""

# Check if .NET is installed
echo "📋 Checking prerequisites..."
if ! command -v dotnet &> /dev/null
then
    echo "❌ .NET SDK is not installed"
    echo ""
    echo "Please install .NET 8.0 SDK:"
    echo "  Option 1: Visit https://dotnet.microsoft.com/download/dotnet/8.0"
    echo "  Option 2: Run 'brew install --cask dotnet-sdk'"
    echo ""
    exit 1
fi

echo "✅ .NET SDK installed: $(dotnet --version)"

# Check if Docker is running (for SQL Server)
if ! command -v docker &> /dev/null
then
    echo "⚠️  Docker is not installed (optional, but recommended for SQL Server)"
    echo "   You can install it from: https://www.docker.com/products/docker-desktop"
else
    echo "✅ Docker is available"
    
    # Check if SQL Server container exists
    if docker ps -a --format '{{.Names}}' | grep -q "^sqlserver2022$"; then
        echo "✅ SQL Server container exists"
        
        # Check if it's running
        if ! docker ps --format '{{.Names}}' | grep -q "^sqlserver2022$"; then
            echo "🔄 Starting SQL Server container..."
            docker start sqlserver2022
            sleep 3
        else
            echo "✅ SQL Server container is running"
        fi
    else
        echo "⚠️  SQL Server container not found"
        echo ""
        echo "Would you like to create it? (y/n)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            echo "🔄 Creating SQL Server container..."
            docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Password123" \
              -p 1433:1433 --name sqlserver2022 \
              -d mcr.microsoft.com/mssql/server:2022-latest
            
            echo "⏳ Waiting for SQL Server to start..."
            sleep 10
            echo "✅ SQL Server container created and running"
        fi
    fi
fi

echo ""
echo "🔄 Navigating to FoodAPI directory..."
cd /Users/haider/Git/FoodApp/FoodAPI

echo "🔄 Restoring NuGet packages..."
dotnet restore

echo ""
echo "🔄 Checking for EF Core tools..."
if ! dotnet ef --version &> /dev/null
then
    echo "⚠️  EF Core tools not found. Installing..."
    dotnet tool install --global dotnet-ef
    export PATH="$PATH:$HOME/.dotnet/tools"
fi

echo ""
echo "🗄️  Applying database migrations..."
dotnet ef database update --project FoodAPI

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Database migration failed. Please check:"
    echo "   1. SQL Server is running"
    echo "   2. Connection string is correct in appsettings.Development.json"
    echo "   3. SQL Server is accessible on localhost:1433"
    echo ""
    echo "You can still try to run the API, but database operations will fail."
    echo ""
fi

echo ""
echo "🚀 Starting FoodAPI..."
echo "   The API will be available at:"
echo "   - Swagger UI: https://localhost:7041/swagger"
echo "   - API Base: https://localhost:7041"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

dotnet run --project FoodAPI
