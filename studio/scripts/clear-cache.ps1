# Clear Next.js build cache and rebuild
Write-Host "Clearing Next.js build cache..." -ForegroundColor Cyan

# Remove .next folder
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ Removed .next folder" -ForegroundColor Green
} else {
    Write-Host "⚠️  .next folder not found" -ForegroundColor Yellow
}

# Remove tsbuildinfo
if (Test-Path "tsconfig.tsbuildinfo") {
    Remove-Item -Force "tsconfig.tsbuildinfo"
    Write-Host "✅ Removed tsconfig.tsbuildinfo" -ForegroundColor Green
}

# Clear node_modules/.cache if exists
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force "node_modules/.cache"
    Write-Host "✅ Removed node_modules/.cache" -ForegroundColor Green
}

Write-Host ""
Write-Host "Cache cleared! Restart the dev server:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White

