@echo off
echo ========================================
echo Testing Agora Token Generation
echo ========================================
echo.

echo Testing token endpoint...
curl -X GET "http://localhost:8080/api/agora/token?channelName=test-channel&userId=12345&role=doctor"

echo.
echo.
echo ========================================
echo Test Complete
echo ========================================
pause
