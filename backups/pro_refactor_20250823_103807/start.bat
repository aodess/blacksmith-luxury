@echo off
echo.
echo ========================================
echo   BLACKSMITH LUXURY - STARTING...
echo ========================================
echo.
echo Opening browser...
timeout /t 2 >nul
start http://localhost:8000
echo.
echo Starting server...
python -m http.server 8000
pause
