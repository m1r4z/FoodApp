#!/bin/bash
# Quick start script for FoodAPI using .NET 8

# Set .NET 8 environment
export PATH="/opt/homebrew/opt/dotnet@8/bin:$PATH"
export DOTNET_ROOT="/opt/homebrew/opt/dotnet@8/libexec"
export PATH="$PATH:/Users/haider/.dotnet/tools"

echo "🚀 Starting FoodAPI with .NET 8..."
echo "📍 API will be available at:"
echo "   - HTTPS: https://localhost:7041"
echo "   - HTTP:  http://localhost:5194"
echo "📖 Swagger UI: https://localhost:7041/swagger"
echo ""
echo "🔒 Note: If using HTTPS for the first time, you may need to run:"
echo "   dotnet dev-certs https --trust"
echo ""

cd "$(dirname "$0")"
dotnet run --project FoodAPI --launch-profile https
