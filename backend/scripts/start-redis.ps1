# Quick Redis Start Script for Windows
# This script helps you start Redis for Celery

Write-Host "========================================="
Write-Host "Redis Setup for Celery"
Write-Host "========================================="
Write-Host ""

# Check if Docker is available
$dockerAvailable = $false
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        $dockerAvailable = $true
        Write-Host "✅ Docker found: $dockerVersion"
    }
} catch {
    Write-Host "❌ Docker not found"
}

# Check if WSL is available
$wslAvailable = $false
try {
    $wslVersion = wsl --version 2>$null
    if ($wslVersion) {
        $wslAvailable = $true
        Write-Host "✅ WSL found"
    }
} catch {
    Write-Host "❌ WSL not found"
}

Write-Host ""
Write-Host "Choose an option:"
Write-Host "1. Use Docker (if Docker Desktop is running)"
Write-Host "2. Use WSL (if WSL is installed)"
Write-Host "3. Manual instructions"
Write-Host ""

$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        if (-not $dockerAvailable) {
            Write-Host "❌ Docker not available. Please install Docker Desktop or choose another option."
            exit 1
        }
        
        Write-Host ""
        Write-Host "Starting Redis with Docker..."
        
        # Check if Redis container already exists
        $redisExists = docker ps -a --filter "name=redis" --format "{{.Names}}" 2>$null
        if ($redisExists -eq "redis") {
            Write-Host "Redis container exists, starting it..."
            docker start redis
        } else {
            Write-Host "Creating new Redis container..."
            docker run -d -p 6379:6379 --name redis redis:latest
        }
        
        Start-Sleep -Seconds 2
        
        # Test connection
        $result = docker exec redis redis-cli ping 2>$null
        if ($result -eq "PONG") {
            Write-Host "✅ Redis is running!"
            Write-Host ""
            Write-Host "Now you can start Celery:"
            Write-Host "  Terminal 1: celery -A core worker --loglevel=info"
            Write-Host "  Terminal 2: celery -A core beat --loglevel=info"
        } else {
            Write-Host "❌ Redis failed to start. Check Docker Desktop is running."
        }
    }
    
    "2" {
        if (-not $wslAvailable) {
            Write-Host "❌ WSL not available. Please install WSL or choose another option."
            exit 1
        }
        
        Write-Host ""
        Write-Host "Starting Redis with WSL..."
        Write-Host "This will open a WSL terminal. Run these commands:"
        Write-Host "  sudo apt-get update"
        Write-Host "  sudo apt-get install redis-server"
        Write-Host "  redis-server"
        Write-Host ""
        Write-Host "Opening WSL..."
        wsl
    }
    
    "3" {
        Write-Host ""
        Write-Host "Manual Setup Instructions:"
        Write-Host "=========================="
        Write-Host ""
        Write-Host "Option A - Docker:"
        Write-Host "  1. Start Docker Desktop"
        Write-Host "  2. Run: docker run -d -p 6379:6379 --name redis redis:latest"
        Write-Host ""
        Write-Host "Option B - WSL:"
        Write-Host "  1. Open WSL: wsl"
        Write-Host "  2. Install: sudo apt-get install redis-server"
        Write-Host "  3. Start: redis-server"
        Write-Host ""
        Write-Host "Option C - Download:"
        Write-Host "  1. Download from: https://github.com/microsoftarchive/redis/releases"
        Write-Host "  2. Extract and run redis-server.exe"
        Write-Host ""
        Write-Host "After Redis is running, start Celery:"
        Write-Host "  Terminal 1: celery -A core worker --loglevel=info"
        Write-Host "  Terminal 2: celery -A core beat --loglevel=info"
    }
    
    default {
        Write-Host "Invalid choice"
    }
}

