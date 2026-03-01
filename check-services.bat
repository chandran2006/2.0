@echo off
echo ========================================
echo MeDora Service Status Check
echo ========================================
echo.

echo Checking Backend (Port 8080)...
netstat -ano | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo [OK] Backend is running on port 8080
) else (
    echo [ERROR] Backend is NOT running on port 8080
    echo Please start backend: cd projectbackend ^&^& mvnw spring-boot:run
)
echo.

echo Checking Frontend (Port 5173)...
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo [OK] Frontend is running on port 5173
) else (
    echo [ERROR] Frontend is NOT running on port 5173
    echo Please start frontend: cd project ^&^& npm run dev
)
echo.

echo Checking Call Server (Port 5002)...
netstat -ano | findstr :5002 >nul
if %errorlevel% equ 0 (
    echo [OK] Call Server is running on port 5002
) else (
    echo [ERROR] Call Server is NOT running on port 5002
    echo Please start call server: cd call-server ^&^& npm start
)
echo.

echo ========================================
echo Testing Backend API...
echo ========================================
curl -s http://localhost:8080/api/auth/test-db
echo.
echo.

echo ========================================
echo Quick Start Commands:
echo ========================================
echo Backend:  cd projectbackend ^&^& mvnw spring-boot:run
echo Frontend: cd project ^&^& npm run dev
echo Call:     cd call-server ^&^& npm start
echo.
echo Test Page: Open test-backend.html in browser
echo H2 Console: http://localhost:8080/h2-console
echo Frontend: http://localhost:5173
echo.

pause
