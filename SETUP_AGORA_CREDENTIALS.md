# 🚨 CRITICAL: Setup Valid Agora Credentials

## Your Current Error
```
AgoraRTCError CAN_NOT_GET_GATEWAY_SERVER: invalid vendor key, can not find appid
```

**This means your Agora App ID is INVALID/FAKE.**

---

## ⚡ Quick Fix (5 Minutes)

### Step 1: Get FREE Agora Account
1. Go to: **https://console.agora.io/**
2. Click **"Sign Up"** (FREE - includes $100 credits)
3. Verify your email

### Step 2: Create Project
1. Click **"Project Management"** in left sidebar
2. Click **"Create"** button
3. Project Name: `MeDora-TeleMedicine`
4. Use Case: `Video Calling`
5. Authentication: **Secured mode: APP ID + Token**
6. Click **"Submit"**

### Step 3: Get Your Credentials
1. Find your project in the list
2. Click the **"👁️ View"** icon next to App ID
3. Copy these TWO values:
   - **App ID** (32 characters, looks like: `a1b2c3d4e5f6789012345678901234ab`)
   - **App Certificate** (32 characters, looks like: `z9y8x7w6v5u4321098765432109876zy`)

---

## Step 4: Update Backend

**File:** `projectbackend/src/main/resources/application.properties`

Replace lines 18-19 with YOUR credentials:

```properties
# Agora Configuration - REPLACE WITH YOUR CREDENTIALS
agora.app.id=PASTE_YOUR_APP_ID_HERE
agora.app.certificate=PASTE_YOUR_APP_CERTIFICATE_HERE
agora.token.expiration=3600
```

**Example (with fake credentials):**
```properties
agora.app.id=a1b2c3d4e5f6789012345678901234ab
agora.app.certificate=z9y8x7w6v5u4321098765432109876zy
agora.token.expiration=3600
```

---

## Step 5: Update Frontend

**File:** `project/.env`

Add/update this line with YOUR App ID:

```env
VITE_AGORA_APP_ID=PASTE_YOUR_APP_ID_HERE
```

**Example:**
```env
VITE_AGORA_APP_ID=a1b2c3d4e5f6789012345678901234ab
```

---

## Step 6: Restart Everything

### Stop All Servers
Press `Ctrl+C` in all terminal windows

### Start Backend
```bash
cd projectbackend
mvnw clean
mvnw spring-boot:run
```

Wait for: `🌐 MeDora Backend Server Started`

### Start Frontend (New Terminal)
```bash
cd project
npm run dev
```

Wait for: `Local: http://localhost:5173/`

---

## Step 7: Test Token Generation

Open browser and go to:
```
http://localhost:8080/api/agora/token?channelName=test&userId=123&role=doctor
```

**✅ Success Response:**
```json
{
  "token": "006a1b2c3d4e5f6789012345678901234abIAA...",
  "channelName": "test",
  "userId": "123"
}
```

**❌ Error Response:**
```json
{
  "error": "Failed to generate token"
}
```
→ Your credentials are still wrong

---

## Step 8: Test Video Call

1. Open Chrome: `http://localhost:5173`
2. Login as Doctor
3. Open Chrome Incognito: `http://localhost:5173`
4. Login as Patient
5. Start a call
6. Both should see each other ✅

---

## Why This Happens

The App IDs in your code are **PLACEHOLDER/FAKE** values:
- `fec296083f304452b43d718b2aaa9d00` ❌ INVALID
- `60dd27c9f69d495f990f502a9268fa05` ❌ INVALID

These don't exist in Agora's system, so you get the error.

---

## Agora Free Tier

✅ **FREE Forever:**
- 10,000 minutes/month
- Perfect for development & testing
- No credit card required for signup

✅ **Included:**
- Video calling
- Audio calling
- Screen sharing
- Recording
- Token generation

---

## Common Mistakes

### ❌ Mistake 1: Using Example Credentials
Don't copy credentials from tutorials/examples. They won't work.

### ❌ Mistake 2: Wrong Project Type
Make sure you selected **"Video Calling"** when creating project.

### ❌ Mistake 3: Not Enabling App Certificate
Must enable **"Secured mode: APP ID + Token"** in project settings.

### ❌ Mistake 4: Not Restarting Servers
Changes only take effect after restarting both backend and frontend.

### ❌ Mistake 5: Typos in Credentials
App ID and Certificate are case-sensitive. Copy-paste exactly.

---

## Verification Checklist

Before testing video call:

- [ ] Created Agora account
- [ ] Created project with Video Calling
- [ ] Copied App ID (32 characters)
- [ ] Copied App Certificate (32 characters)
- [ ] Updated `application.properties` with real credentials
- [ ] Updated `.env` with real App ID
- [ ] Restarted backend server
- [ ] Restarted frontend dev server
- [ ] Token endpoint returns valid token
- [ ] No console errors about App ID

---

## Still Getting Error?

### Check 1: Verify Credentials Format
App ID should be **exactly 32 characters** (hexadecimal):
```
✅ a1b2c3d4e5f6789012345678901234ab (32 chars)
❌ a1b2c3d4 (too short)
❌ a1b2c3d4-e5f6-7890 (has dashes)
```

### Check 2: Check Backend Logs
Look for this when backend starts:
```
App ID: a1b2c3d4e5f6789012345678901234ab
```

If you see the old fake ID, you didn't restart properly.

### Check 3: Check Frontend Console
Press F12, look for:
```
App ID being used: a1b2c3d4e5f6789012345678901234ab
```

If you see the old fake ID, clear cache (Ctrl+Shift+Delete) and refresh.

---

## Need Help?

1. **Agora Console:** https://console.agora.io/
2. **Agora Docs:** https://docs.agora.io/en/video-calling/get-started/get-started-sdk
3. **Agora Support:** https://www.agora.io/en/support/

---

## Summary

**YOU CANNOT USE VIDEO CALLING WITHOUT VALID AGORA CREDENTIALS.**

The credentials in your code are fake/invalid. You must:
1. Create FREE Agora account (5 minutes)
2. Get real App ID + Certificate
3. Update both backend and frontend
4. Restart servers
5. Test

**No other solution exists. This is mandatory.** 🚨
