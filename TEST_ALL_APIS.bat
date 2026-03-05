@echo off
echo ========================================
echo MeDora API Verification Script
echo ========================================
echo.

echo Testing Backend Connection...
curl -s http://localhost:8080/api/auth/test-db >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Backend is not running on port 8080
    echo Please start backend: cd projectbackend ^&^& mvnw spring-boot:run
    pause
    exit /b 1
) else (
    echo [PASS] Backend is running
)
echo.

echo Testing Agora Token Generation...
curl -s "http://localhost:8080/api/agora/token?channelName=test&userId=123&role=doctor" > temp_token.json
findstr /C:"token" temp_token.json >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Agora token generation failed
    echo Check Agora credentials in application.properties
    type temp_token.json
) else (
    echo [PASS] Agora token generated successfully
)
del temp_token.json >nul 2>&1
echo.

echo Testing Authentication Endpoints...
curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"patient1@teleasha.com\",\"password\":\"password123\"}" > temp_login.json
findstr /C:"id" temp_login.json >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Login endpoint failed
    type temp_login.json
) else (
    echo [PASS] Login endpoint working
)
del temp_login.json >nul 2>&1
echo.

echo Testing Doctors List...
curl -s http://localhost:8080/api/appointments/doctors > temp_doctors.json
findstr /C:"[" temp_doctors.json >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Doctors list endpoint failed
) else (
    echo [PASS] Doctors list endpoint working
)
del temp_doctors.json >nul 2>&1
echo.

echo Testing Available Doctors...
curl -s http://localhost:8080/api/calls/doctors/available > temp_available.json
findstr /C:"doctors" temp_available.json >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Available doctors endpoint failed
) else (
    echo [PASS] Available doctors endpoint working
)
del temp_available.json >nul 2>&1
echo.

echo Testing Medicines Search...
curl -s "http://localhost:8080/api/medicines/search?q=para" > temp_medicines.json
findstr /C:"[" temp_medicines.json >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Medicine search endpoint failed
) else (
    echo [PASS] Medicine search endpoint working
)
del temp_medicines.json >nul 2>&1
echo.

echo Testing Pharmacies List...
curl -s http://localhost:8080/api/pharmacies > temp_pharmacies.json
findstr /C:"[" temp_pharmacies.json >nul 2>&1
if %errorlevel% neq 0 (
    echo [FAIL] Pharmacies endpoint failed
) else (
    echo [PASS] Pharmacies endpoint working
)
del temp_pharmacies.json >nul 2>&1
echo.

echo ========================================
echo Verification Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Start frontend: cd project ^&^& npm run dev
echo 2. Open http://localhost:5173
echo 3. Test video call flow:
echo    - Login as doctor and go online
echo    - Login as patient (incognito) and call doctor
echo    - Test accept/reject/end call
echo.
pause
