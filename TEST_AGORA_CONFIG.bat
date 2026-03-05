@echo off
echo ========================================
echo Testing Agora Configuration
echo ========================================
echo.
echo App ID: fec296083f304452b43d718b2aaa9d00
echo Certificate: 60dd27c9f69d495f990f502a9268fa05
echo.
echo ========================================
echo Step 1: Testing Backend Token Generation
echo ========================================
echo.

curl -X GET "http://localhost:8080/api/agora/token?channelName=test-room&userId=12345&role=doctor"

echo.
echo.
echo ========================================
echo Step 2: Check Agora Project Status
echo ========================================
echo.
echo Please verify in Agora Console:
echo 1. Go to: https://console.agora.io/
echo 2. Check if project exists with App ID: fec296083f304452b43d718b2aaa9d00
echo 3. Verify project status is ACTIVE (not disabled/deleted)
echo 4. Check if "Secured mode: APP ID + Token" is enabled
echo.
echo ========================================
echo Common Issues:
echo ========================================
echo.
echo 1. Project Disabled/Deleted
echo    - Agora may have disabled the project
echo    - Create a new project and update credentials
echo.
echo 2. Wrong Project Type
echo    - Must be "Video Calling" project
echo    - Not "Voice Calling" or "Live Streaming"
echo.
echo 3. Certificate Not Enabled
echo    - Must enable "Secured mode" in project settings
echo.
echo 4. Free Trial Expired
echo    - Check if your free credits are exhausted
echo    - Add payment method or create new account
echo.
echo ========================================
pause
