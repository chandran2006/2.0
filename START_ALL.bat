@echo off
echo ========================================
echo MeDora TeleMedicine Application
echo ========================================
echo.

echo [1/3] Starting Backend Server...
start "MeDora Backend" cmd /k "cd projectbackend && mvnw spring-boot:run"
timeout /t 5

echo [2/3] Starting Call Server...
start "MeDora Call Server" cmd /k "cd call-server && npm start"
timeout /t 3

echo [3/3] Starting Frontend...
start "MeDora Frontend" cmd /k "cd project && npm run dev"

echo.
echo ========================================
echo All services started successfully!
echo ========================================
echo Backend:     http://localhost:8080
echo Frontend:    http://localhost:5173
echo Call Server: http://localhost:5002
echo H2 Console:  http://localhost:8080/h2-console
echo ========================================
echo.
echo Demo Accounts:
echo - Patient:  patient1@teleasha.com / password123
echo - Doctor:   dr.sharma@teleasha.com / password123
echo - Pharmacy: pharmacy@teleasha.com / pharmacy123
echo - Admin:    admin@teleasha.com / admin123
echo.
echo Press any key to exit...
pause
