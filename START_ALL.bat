@echo off
echo ========================================
echo   MeDora TeleMedicine Application
echo   Starting All Servers...
echo ========================================
echo.

echo [1/3] Starting Backend Server...
start "MeDora Backend" cmd /k "cd projectbackend && mvnw.cmd spring-boot:run"
timeout /t 5 /nobreak >nul

echo [2/3] Starting Frontend Server...
start "MeDora Frontend" cmd /k "cd project && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Call Server...
start "MeDora Call Server" cmd /k "cd call-server && npm start"

echo.
echo ========================================
echo   All servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo Calls:    http://localhost:5002
echo.
echo Test DB:  http://localhost:8080/api/auth/test-db
echo H2 Console: http://localhost:8080/h2-console
echo.
echo Demo Accounts:
echo   Patient:  patient1@teleasha.com / password123
echo   Doctor:   dr.sharma@teleasha.com / password123
echo   Pharmacy: pharmacy@teleasha.com / pharmacy123
echo   Admin:    admin@teleasha.com / admin123
echo.
echo Wait 30 seconds for all servers to start, then open:
echo http://localhost:5173
echo.
pause
