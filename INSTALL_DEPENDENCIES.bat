@echo off
echo ========================================
echo MeDora - Installing Dependencies
echo ========================================
echo.

echo [1/3] Installing Frontend Dependencies...
cd project
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [2/3] Installing Call Server Dependencies...
cd call-server
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Call server installation failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [3/3] Building Backend...
cd projectbackend
call mvnw.cmd clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed!
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run START_ALL.bat to start all services
echo 2. Open http://localhost:5173 in your browser
echo 3. Login with demo accounts (see README.md)
echo.
pause
