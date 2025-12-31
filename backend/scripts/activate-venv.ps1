# Virtual Environment Activation Script
# This script helps activate the Python virtual environment on Windows

Write-Host "Activating Python virtual environment..." -ForegroundColor Cyan

# Check if venv exists
if (Test-Path "backend\venv\Scripts\Activate.ps1") {
    # Method 1: Try direct activation
    Write-Host "Found venv at: backend\venv\" -ForegroundColor Cyan
    try {
        # Change to backend directory and activate
        Push-Location backend
        & ".\venv\Scripts\Activate.ps1"
        Write-Host "✅ Virtual environment activated!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
        Write-Host "Python: $(python --version 2>&1)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "You're now in the backend directory with venv activated." -ForegroundColor Cyan
        Write-Host "Run Django commands like: python manage.py runserver" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ PowerShell activation failed. Trying cmd.exe method..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Use Command Prompt instead:" -ForegroundColor Yellow
        Write-Host "  cmd" -ForegroundColor White
        Write-Host "  cd backend" -ForegroundColor White
        Write-Host "  venv\Scripts\activate.bat" -ForegroundColor White
    }
} else {
    Write-Host "❌ Virtual environment not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Create one with:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  python -m venv venv" -ForegroundColor White
    Write-Host "  .\venv\Scripts\activate" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "If activation failed due to execution policy, run:" -ForegroundColor Yellow
Write-Host "  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor White
Write-Host ""
Write-Host "Or use cmd.exe instead:" -ForegroundColor Yellow
Write-Host "  cmd" -ForegroundColor White
Write-Host "  cd backend" -ForegroundColor White
Write-Host "  venv\Scripts\activate.bat" -ForegroundColor White

