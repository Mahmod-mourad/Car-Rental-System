# Backend Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting Backend - Car Rental System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location -Path "$PSScriptRoot\Car-Rental-System-backend"

Write-Host "📦 Building backend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "🗄️  Running migrations..." -ForegroundColor Yellow
    npx typeorm migration:run -d dist/config/typeorm.config.js
    
    Write-Host ""
    Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
    Write-Host "   Backend will run on: http://localhost:3001" -ForegroundColor Green
    Write-Host "   API Docs: http://localhost:3001/api" -ForegroundColor Green
    Write-Host ""
    
    npm run start:dev
} else {
    Write-Host "❌ Build failed! Please check errors above." -ForegroundColor Red
    pause
}
