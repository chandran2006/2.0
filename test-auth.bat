@echo off
echo Testing MeDora Backend Authentication...
echo.

echo 1. Testing database connection...
curl -X GET http://localhost:8080/api/auth/test-db
echo.
echo.

echo 2. Testing login with demo patient account...
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"patient1@teleasha.com\",\"password\":\"password123\"}"
echo.
echo.

echo 3. Testing login with demo doctor account...
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"dr.sharma@teleasha.com\",\"password\":\"password123\"}"
echo.
echo.

echo Done!
pause
