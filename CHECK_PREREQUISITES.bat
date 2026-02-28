@echo off
echo ========================================
echo MeDora Prerequisites Check
echo ========================================
echo.

echo Checking Java...
java -version 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java not found! Please install Java 17+
    echo Download from: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
) else (
    echo [OK] Java is installed
)
echo.

echo Checking Node.js...
node -v 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Please install Node.js 16+
    echo Download from: https://nodejs.org/
) else (
    echo [OK] Node.js is installed
)
echo.

echo Checking npm...
npm -v 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm not found!
) else (
    echo [OK] npm is installed
)
echo.

echo ========================================
echo Checking Project Structure...
echo ========================================
echo.

if exist "projectbackend\pom.xml" (
    echo [OK] Backend project found
) else (
    echo [ERROR] Backend project not found
)

if exist "project\package.json" (
    echo [OK] Frontend project found
) else (
    echo [ERROR] Frontend project not found
)

if exist "call-server\package.json" (
    echo [OK] Call server project found
) else (
    echo [ERROR] Call server project not found
)

echo.
echo ========================================
echo Check Complete!
echo ========================================
echo.
echo If all checks passed, run START_ALL.bat to start the application
echo.
pause
