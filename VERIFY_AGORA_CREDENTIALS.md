# Agora Credentials Verification

## Your Current Credentials
```
App ID: fec296083f304452b43d718b2aaa9d00
Certificate: 60dd27c9f69d495f990f502a9268fa05
```

## ✅ Verification Steps

### Step 1: Verify Agora Console

1. Go to: **https://console.agora.io/**
2. Login to your account
3. Go to **"Project Management"**
4. Find project with App ID: `fec296083f304452b43d718b2aaa9d00`

**Check these:**
- [ ] Project exists and is visible
- [ ] Project status is **ACTIVE** (not disabled/deleted)
- [ ] Project type is **"Video Calling"** or **"RTC"**
- [ ] **"Secured mode: APP ID + Token"** is ENABLED
- [ ] Primary Certificate matches: `60dd27c9f69d495f990f502a9268fa05`

### Step 2: Check Project Settings

In your Agora project settings:

1. Click on **"Config"** or **"Settings"**
2. Verify:
   - [ ] **App Certificate** is enabled
   - [ ] **Token expiration** is set (default: 24 hours)
   - [ ] **Services** include "Video Call"
   - [ ] No IP whitelist restrictions (or your IP is whitelisted)

### Step 3: Test Backend Token Generation

**Restart backend first:**
```bash
cd projectbackend
mvnw spring-boot:run
```

**Then test:**
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

**If you get error:** Backend can't generate token - check certificate

### Step 4: Test Frontend

**Restart frontend:**
```bash
cd project
npm run dev
```

**Open browser console (F12) and check:**
```
App ID being used: fec296083f304452b43d718b2aaa9d00
```

**If different:** Clear cache (Ctrl+Shift+Delete) and refresh

---

## Common Issues

### Issue 1: Project Disabled/Deleted
**Symptom:** "invalid vendor key, can not find appid"
**Cause:** Agora disabled/deleted your project
**Fix:** 
1. Check Agora Console if project exists
2. If deleted, create new project
3. Update credentials in code

### Issue 2: Wrong Project Type
**Symptom:** Token generates but can't join channel
**Cause:** Project is "Voice Call" not "Video Call"
**Fix:** Create new "Video Calling" project

### Issue 3: Certificate Not Enabled
**Symptom:** Can join without token (insecure)
**Cause:** App Certificate not enabled
**Fix:** Enable "Secured mode" in project settings

### Issue 4: Free Trial Expired
**Symptom:** "Account suspended" or similar
**Cause:** Used all free credits
**Fix:** 
1. Add payment method
2. Or create new Agora account

### Issue 5: IP Restrictions
**Symptom:** Works on some networks, not others
**Cause:** IP whitelist in Agora project
**Fix:** Remove IP restrictions or add your IP

---

## Alternative: Create New Project

If your current project has issues, create a new one:

### Step 1: Create New Project
1. Go to https://console.agora.io/
2. Click **"Create"** in Project Management
3. Name: `MeDora-Video-Call`
4. Use Case: **Video Calling**
5. Authentication: **Secured mode: APP ID + Token**
6. Click **"Submit"**

### Step 2: Get New Credentials
1. Click **"View"** icon next to new project
2. Copy **App ID** (32 characters)
3. Copy **Primary Certificate** (32 characters)

### Step 3: Update Backend
Edit: `projectbackend/src/main/resources/application.properties`
```properties
agora.app.id=YOUR_NEW_APP_ID
agora.app.certificate=YOUR_NEW_CERTIFICATE
```

### Step 4: Update Frontend
Edit: `project/.env`
```env
VITE_AGORA_APP_ID=YOUR_NEW_APP_ID
```

### Step 5: Restart Both Servers
```bash
# Backend
cd projectbackend
mvnw spring-boot:run

# Frontend (new terminal)
cd project
npm run dev
```

---

## Debug Mode

### Enable Agora SDK Debug Logs

Add to `VideoCall.tsx` (line 12):
```typescript
AgoraRTC.setLogLevel(0); // 0 = DEBUG
```

This will show detailed Agora SDK logs in console.

### Check Backend Logs

Look for these in backend console:
```
=== Generating Agora Token ===
App ID: fec296083f304452b43d718b2aaa9d00
Channel: test
User ID: 123
Generated token: 006fec296083f304452b43d718b2aaa9d00IAA...
```

If you see errors here, certificate is wrong.

---

## Test Sequence

### Test 1: Backend Token Generation
```bash
curl "http://localhost:8080/api/agora/token?channelName=test&userId=123&role=doctor"
```
✅ Should return valid token

### Test 2: Frontend App ID
1. Open: http://localhost:5173
2. Press F12 (console)
3. Navigate to video call page
4. Check console for: `App ID being used: fec296083f304452b43d718b2aaa9d00`

✅ Should show correct App ID

### Test 3: Join Channel
1. Try to join a call
2. Check console logs
3. Look for: `✓ Successfully joined channel`

✅ Should join without errors

### Test 4: Two Users
1. Open Chrome: Login as Doctor
2. Open Chrome Incognito: Login as Patient
3. Both join same call
4. Both should see each other

✅ Video call should work

---

## Still Not Working?

### Collect This Information:

1. **Agora Console Screenshot**
   - Show your project list
   - Show project status (active/disabled)

2. **Backend Console Output**
   - Copy all logs when starting server
   - Copy token generation logs

3. **Frontend Console Output**
   - Press F12
   - Copy all errors in red
   - Copy Agora SDK logs

4. **Test Results**
   - Token generation test result
   - App ID verification result
   - Join channel error message

---

## Quick Checklist

Before asking for help, verify:

- [ ] Agora account is active
- [ ] Project exists in Agora Console
- [ ] Project status is ACTIVE
- [ ] App Certificate is enabled
- [ ] Credentials match in both backend and frontend
- [ ] Backend server restarted after credential update
- [ ] Frontend dev server restarted after credential update
- [ ] Browser cache cleared
- [ ] Token generation endpoint works
- [ ] App ID shows correctly in console

---

## Contact Agora Support

If credentials are correct but still not working:

1. **Agora Support:** https://www.agora.io/en/support/
2. **Agora Community:** https://www.agora.io/en/community/
3. **Agora Docs:** https://docs.agora.io/

Provide them with:
- Your App ID
- Error message
- When the issue started
- What you've tried

---

## Summary

Your credentials are configured correctly in the code. The error suggests:

1. **Most Likely:** Agora project is disabled/deleted
2. **Also Possible:** Wrong project type or settings
3. **Less Likely:** Network/firewall issues

**Next Step:** Login to Agora Console and verify your project status.
