@echo off
echo ========================================
echo Testing Auth Endpoints
echo ========================================
echo.

echo [1] Testing Database Connection...
curl -X GET http://localhost:8080/api/auth/test-db
echo.
echo.

echo [2] Testing Registration...
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\",\"name\":\"Test User\",\"role\":\"PATIENT\"}"
echo.
echo.

echo [3] Testing Login...
curl -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"
echo.
echo.

echo [4] Testing Doctor Registration...
curl -X POST http://localhost:8080/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"doctor@test.com\",\"password\":\"test123\",\"name\":\"Dr. Test\",\"role\":\"DOCTOR\",\"specialization\":\"General\"}"
echo.
echo.

pause
