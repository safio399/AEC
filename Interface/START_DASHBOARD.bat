@echo off
REM Merged Dashboard - One Click Start Script
REM This script starts the merged dashboard immediately

cd /d "%~dp0gam-risk-sentinel"

echo.
echo ============================================
echo  GAM Assurances Merged Dashboard
echo  Starting Development Server...
echo ============================================
echo.

call npm run dev

echo.
echo ============================================
echo  Dashboard running at:
echo  http://localhost:8080/
echo ============================================
echo.
pause
