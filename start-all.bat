@echo off
echo.
echo ========================================
echo   MeDora - Auto Network Setup
echo ========================================
echo.

cd project
echo [1/3] Setting up frontend network configuration...
call npm run setup-network
echo.

echo [2/3] Starting backend server...
start "MeDora Backend" cmd /k "cd ..\projectbackend && mvnw spring-boot:run"
timeout /t 5 /nobreak >nul

echo [3/3] Starting frontend...
start "MeDora Frontend" cmd /k "npm run dev:local"
echo.

echo ========================================
echo   All services starting...
echo   Check the opened windows for URLs
echo ========================================
echo.
pause
