@echo off
echo ========================================
echo Update Agora Credentials
echo ========================================
echo.
echo This script will help you update your Agora App ID and Certificate
echo.
echo First, create a new project at: https://console.agora.io/
echo.
pause
echo.

set /p APP_ID="Enter your NEW Agora App ID (32 characters): "
set /p CERTIFICATE="Enter your NEW Agora Certificate (32 characters): "

echo.
echo Updating credentials...
echo.

REM Update backend application.properties
echo Updating backend...
powershell -Command "(Get-Content 'projectbackend\src\main\resources\application.properties') -replace 'agora.app.id=\$\{AGORA_APP_ID:.*\}', 'agora.app.id=${AGORA_APP_ID:%APP_ID%}' | Set-Content 'projectbackend\src\main\resources\application.properties'"
powershell -Command "(Get-Content 'projectbackend\src\main\resources\application.properties') -replace 'agora.app.certificate=\$\{AGORA_APP_CERTIFICATE:.*\}', 'agora.app.certificate=${AGORA_APP_CERTIFICATE:%CERTIFICATE%}' | Set-Content 'projectbackend\src\main\resources\application.properties'"

REM Update frontend .env
echo Updating frontend...
powershell -Command "(Get-Content 'project\.env') -replace 'VITE_AGORA_APP_ID=.*', 'VITE_AGORA_APP_ID=%APP_ID%' | Set-Content 'project\.env'"

echo.
echo ========================================
echo Credentials Updated Successfully!
echo ========================================
echo.
echo App ID: %APP_ID%
echo Certificate: %CERTIFICATE%
echo.
echo Next Steps:
echo 1. Restart backend: cd projectbackend ^&^& mvnw spring-boot:run
echo 2. Restart frontend: cd project ^&^& npm run dev
echo 3. Clear browser cache (Ctrl+Shift+Delete)
echo 4. Test video call
echo.
pause
