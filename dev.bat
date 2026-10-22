@echo off
title OMNIFIT Dev Server

echo ============================================
echo   OMNIFIT - Starting Development Servers
echo ============================================
echo.

echo [1/2] Starting Django Backend on http://127.0.0.1:8000 ...
start "OMNIFIT Backend" cmd /k "cd /d "%~dp0backend" && call venv\Scripts\activate && python manage.py runserver"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Vite Frontend on http://localhost:3000 ...
start "OMNIFIT Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ============================================
echo   Both servers are starting up!
echo   Backend  -> http://127.0.0.1:8000
echo   Frontend -> http://localhost:3000
echo ============================================
echo.
pause
