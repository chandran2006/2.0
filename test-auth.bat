@echo off
echo Testing Backend Authentication...
echo.

echo 1. Testing database connection...
curl -X GET http://localhost:8080/api/auth/test-db
echo.
echo.

echo 2. Testing login with patient credentials...
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"patient1@teleasha.com\",\"password\":\"password123\"}"
echo.
echo.

echo 3. Testing login with doctor credentials...
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"dr.sharma@teleasha.com\",\"password\":\"password123\"}"
echo.
echo.

echo 4. Testing registration...
curl -X POST http://localhost:8080/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"New User\",\"email\":\"newuser@test.com\",\"password\":\"test123\",\"role\":\"PATIENT\"}"
echo.
echo.

echo Tests complete!
pause
