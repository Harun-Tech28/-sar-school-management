# Kill all Node processes (including Next.js dev server)
Write-Host "🔍 Finding Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "✅ Node processes terminated" -ForegroundColor Green

# Remove lock file
Write-Host "🔍 Removing lock file..." -ForegroundColor Yellow
if (Test-Path ".next\dev\lock") {
    Remove-Item ".next\dev\lock" -Force
    Write-Host "✅ Lock file removed" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No lock file found" -ForegroundColor Cyan
}

# Optional: Clear .next cache
Write-Host ""
$clearCache = Read-Host "Do you want to clear .next cache? (y/n)"
if ($clearCache -eq "y") {
    Write-Host "🗑️  Clearing .next cache..." -ForegroundColor Yellow
    if (Test-Path ".next") {
        Remove-Item ".next" -Recurse -Force
        Write-Host "✅ Cache cleared" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✅ Ready to restart!" -ForegroundColor Green
Write-Host "Run: npm run dev" -ForegroundColor Cyan
