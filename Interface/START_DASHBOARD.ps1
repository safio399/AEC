# Merged Dashboard - One Click Start Script (PowerShell)
# This script starts the merged dashboard immediately

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host " GAM Assurances Merged Dashboard" -ForegroundColor Green
Write-Host " Starting Development Server..." -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

Set-Location "$PSScriptRoot\gam-risk-sentinel"

npm run dev

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host " Dashboard running at:" -ForegroundColor Green
Write-Host " http://localhost:8080/" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
