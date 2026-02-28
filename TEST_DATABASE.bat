@echo off
echo ========================================
echo   MeDora Database Connectivity Test
echo ========================================
echo.

echo [1/3] Testing Backend Server...
timeout /t 2 /nobreak >nul
curl -s http://localhost:8080/api/auth/test-db >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend is running
    curl http://localhost:8080/api/auth/test-db
) else (
    echo [ERROR] Backend is not running
    echo Please start backend: cd projectbackend ^&^& mvnw.cmd spring-boot:run
)
echo.

echo [2/3] Testing H2 Database Console...
timeout /t 1 /nobreak >nul
curl -s http://localhost:8080/h2-console >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] H2 Console is accessible
    echo URL: http://localhost:8080/h2-console
    echo JDBC URL: jdbc:h2:mem:medora
    echo Username: root
    echo Password: Chandran@2006
) else (
    echo [ERROR] H2 Console not accessible
)
echo.

echo [3/3] Testing Frontend Connection...
timeout /t 1 /nobreak >nul
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend is running
    echo URL: http://localhost:5173
) else (
    echo [ERROR] Frontend is not running
    echo Please start frontend: cd project ^&^& npm run dev
)
echo.

echo ========================================
echo   Database Connection Summary
echo ========================================
echo.
echo Backend API:     http://localhost:8080
echo Test Endpoint:   http://localhost:8080/api/auth/test-db
echo H2 Console:      http://localhost:8080/h2-console
echo Frontend:        http://localhost:5173
echo.
echo To verify database:
echo 1. Open H2 Console: http://localhost:8080/h2-console
echo 2. JDBC URL: jdbc:h2:mem:medora
echo 3. Username: root
echo 4. Password: Chandran@2006
echo 5. Click Connect
echo 6. Run: SELECT * FROM USERS;
echo.
pause
