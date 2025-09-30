# Frontend Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Frontend - Car Rental System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
Set-Location -Path "$PSScriptRoot\Car-Rental-System-Frontend"

Write-Host "🚀 Starting frontend server..." -ForegroundColor Yellow
Write-Host "   Frontend will run on: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Make sure backend is running on port 3001!" -ForegroundColor Yellow
Write-Host ""

npm run dev
