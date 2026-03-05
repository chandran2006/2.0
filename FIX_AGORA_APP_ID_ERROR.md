# Fix Agora App ID Error - "CAN_NOT_GET_GATEWAY_SERVER"

## Problem
Error: `AgoraRTCError CAN_NOT_GET_GATEWAY_SERVER: invalid vendor key, can not find appid`

This means your Agora App ID is **invalid, expired, or doesn't exist**.

---

## Solution: Get Valid Agora Credentials

### Step 1: Create Agora Account
1. Go to: https://console.agora.io/
2. Sign up or log in
3. Create a new project

### Step 2: Get Your Credentials
1. In Agora Console, go to **Project Management**
2. Click on your project
3. Copy these values:
   - **App ID** (32-character hex string)
   - **App Certificate** (32-character hex string)

### Step 3: Update Backend Configuration

Edit: `projectbackend/src/main/resources/application.properties`

```properties
# Agora Configuration
agora.app.id=YOUR_ACTUAL_APP_ID_HERE
agora.app.certificate=YOUR_ACTUAL_APP_CERTIFICATE_HERE
agora.token.expiration=3600
```

**Example:**
```properties
agora.app.id=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
agora.app.certificate=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4
```

### Step 4: Update Frontend Configuration

Edit: `project/.env`

```env
# Agora Configuration
VITE_AGORA_APP_ID=YOUR_ACTUAL_APP_ID_HERE
```

**Example:**
```env
VITE_AGORA_APP_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### Step 5: Restart Both Servers

**Backend:**
```bash
cd projectbackend
mvnw spring-boot:run
```

**Frontend:**
```bash
cd project
npm run dev
```

---

## Current Configuration

### Backend (application.properties)
```
agora.app.id=fec296083f304452b43d718b2aaa9d00
agora.app.certificate=60dd27c9f69d495f990f502a9268fa05
```

### Frontend (.env)
```
VITE_AGORA_APP_ID=fec296083f304452b43d718b2aaa9d00
```

**⚠️ These credentials appear to be invalid. You MUST replace them with valid credentials from your Agora Console.**

---

## How to Verify Your Credentials

### Test Backend Token Generation
```bash
curl "http://localhost:8080/api/agora/token?channelName=test&userId=123&role=doctor"
```

**Expected Response:**
```json
{
  "token": "006fec296083f304452b43d718b2aaa9d00IAA...",
  "channelName": "test",
  "userId": "123"
}
```

If you get an error, your backend credentials are wrong.

### Test Frontend Connection
1. Open browser console (F12)
2. Navigate to video call page
3. Check console logs for:
   ```
   App ID being used: YOUR_APP_ID
   ```
4. If it shows the wrong App ID, clear cache and restart dev server

---

## Agora Project Settings

### Required Settings in Agora Console:
1. **Enable App Certificate**: YES
2. **Authentication**: Token-based
3. **Services**: 
   - ✅ Video Call
   - ✅ Voice Call
4. **Token Expiration**: 3600 seconds (1 hour)

---

## Common Issues

### Issue 1: "Invalid App ID"
**Cause**: App ID is wrong or doesn't exist
**Fix**: Copy correct App ID from Agora Console

### Issue 2: "Token Generation Failed"
**Cause**: App Certificate is wrong
**Fix**: Copy correct App Certificate from Agora Console

### Issue 3: "Token Expired"
**Cause**: Token expired (default 1 hour)
**Fix**: Generate new token (happens automatically)

### Issue 4: "Changes Not Reflected"
**Cause**: Server not restarted or cache issue
**Fix**: 
- Restart backend server
- Restart frontend dev server
- Clear browser cache (Ctrl+Shift+Delete)

---

## Testing Checklist

After updating credentials:

- [ ] Backend starts without errors
- [ ] Token endpoint returns valid token
- [ ] Frontend loads without console errors
- [ ] Video call page loads
- [ ] Camera/microphone permissions requested
- [ ] Successfully joins Agora channel
- [ ] Local video appears
- [ ] Remote user can join
- [ ] Both users see each other

---

## Quick Fix Script

Create `UPDATE_AGORA_CREDENTIALS.bat`:

```batch
@echo off
echo ========================================
echo Update Agora Credentials
echo ========================================
echo.
echo Please enter your Agora credentials:
echo.
set /p APP_ID="App ID: "
set /p APP_CERT="App Certificate: "
echo.
echo Updating backend...
echo agora.app.id=%APP_ID% >> projectbackend\src\main\resources\application.properties
echo agora.app.certificate=%APP_CERT% >> projectbackend\src\main\resources\application.properties
echo.
echo Updating frontend...
echo VITE_AGORA_APP_ID=%APP_ID% >> project\.env
echo.
echo Done! Please restart both servers.
pause
```

---

## Need Help?

1. **Agora Documentation**: https://docs.agora.io/
2. **Get Free Credits**: Agora provides $100 free credits for testing
3. **Support**: https://www.agora.io/en/support/

---

## Summary

The error occurs because the Agora App ID in your code is invalid. You must:

1. ✅ Create an Agora account
2. ✅ Get valid App ID and Certificate
3. ✅ Update `application.properties` (backend)
4. ✅ Update `.env` (frontend)
5. ✅ Restart both servers
6. ✅ Test the video call

**Without valid Agora credentials, video calling will NOT work.**
