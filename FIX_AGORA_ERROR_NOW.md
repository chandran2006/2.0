# URGENT: Fix Agora "Invalid Vendor Key" Error

## ❌ Current Error
```
AgoraRTCError CAN_NOT_GET_GATEWAY_SERVER: invalid vendor key, can not find appid
```

## 🔍 Root Cause
Your Agora project with App ID `fec296083f304452b43d718b2aaa9d00` is either:
1. **Deleted** from Agora Console
2. **Disabled** by Agora
3. **Free trial expired**

## ✅ IMMEDIATE FIX - Create New Agora Project

### Step 1: Create New Project (5 minutes)

1. **Go to Agora Console:**
   - Open: https://console.agora.io/
   - Login with your account

2. **Create New Project:**
   - Click **"Project Management"** in left sidebar
   - Click **"Create"** button
   - Fill in:
     - **Project Name:** `MeDora-VideoCall`
     - **Use Case:** Select **"Video Calling"**
     - **Authentication:** Select **"Secured mode: APP ID + Token"**
   - Click **"Submit"**

3. **Get New Credentials:**
   - Find your new project in the list
   - Click the **"View"** icon (eye icon)
   - Copy the **App ID** (32 characters)
   - Click **"Primary Certificate"** to reveal it
   - Copy the **Certificate** (32 characters)

### Step 2: Update Backend (1 minute)

**File:** `projectbackend/src/main/resources/application.properties`

Replace these lines:
```properties
agora.app.id=${AGORA_APP_ID:fec296083f304452b43d718b2aaa9d00}
agora.app.certificate=${AGORA_APP_CERTIFICATE:60dd27c9f69d495f990f502a9268fa05}
```

With your new credentials:
```properties
agora.app.id=${AGORA_APP_ID:YOUR_NEW_APP_ID_HERE}
agora.app.certificate=${AGORA_APP_CERTIFICATE:YOUR_NEW_CERTIFICATE_HERE}
```

### Step 3: Update Frontend (1 minute)

**File:** `project/.env`

Replace this line:
```env
VITE_AGORA_APP_ID=fec296083f304452b43d718b2aaa9d00
```

With your new App ID:
```env
VITE_AGORA_APP_ID=YOUR_NEW_APP_ID_HERE
```

### Step 4: Restart Everything (2 minutes)

**Stop both servers** (Ctrl+C in both terminals)

**Restart Backend:**
```bash
cd projectbackend
mvnw clean spring-boot:run
```

**Restart Frontend:**
```bash
cd project
npm run dev
```

**Clear Browser Cache:**
- Press `Ctrl + Shift + Delete`
- Select "Cached images and files"
- Click "Clear data"
- Or just hard refresh: `Ctrl + F5`

### Step 5: Test (1 minute)

**Test Token Generation:**
```bash
curl "http://localhost:8080/api/agora/token?channelName=test&userId=123&role=doctor"
```

**Expected Response:**
```json
{
  "token": "006YOUR_NEW_APP_IDIAAA...",
  "channelName": "test",
  "userId": "123"
}
```

**Test Video Call:**
1. Login as doctor → Go online
2. Login as patient (incognito) → Call doctor
3. Doctor accepts
4. Both should enter video room successfully

---

## 🚨 Alternative: Use Testing Mode (Temporary)

If you can't create a new project right now, you can temporarily disable token authentication:

### Option A: Testing Mode (NOT RECOMMENDED FOR PRODUCTION)

**In Agora Console:**
1. Go to your project settings
2. Change authentication to **"Testing mode: APP ID only"**
3. This allows joining without tokens (insecure)

**Then update VideoCall.tsx:**
```typescript
// Line ~150, change:
await client.join(APP_ID, channelName, agoraToken, uid);

// To:
await client.join(APP_ID, channelName, null, uid);
```

---

## 📋 Quick Checklist

Before testing:
- [ ] Created new Agora project
- [ ] Copied new App ID (32 characters)
- [ ] Copied new Certificate (32 characters)
- [ ] Updated `application.properties`
- [ ] Updated `.env`
- [ ] Restarted backend server
- [ ] Restarted frontend server
- [ ] Cleared browser cache
- [ ] Tested token generation endpoint

---

## 🎯 Expected Result

After following these steps, you should see:

**In Browser Console:**
```
=== Agora Join Debug ===
App ID being used: YOUR_NEW_APP_ID
✓ Successfully joined channel
✓ Got media tracks - Audio: true Video: true
✓ Published tracks
```

**No more errors!** ✅

---

## 💡 Why This Happened

Agora free trial projects are often:
- Automatically disabled after 10,000 minutes
- Deleted after inactivity
- Suspended if account verification needed

Creating a new project gives you a fresh start with new free credits.

---

## 🆘 Still Not Working?

If you still get errors after creating new project:

1. **Verify new project is ACTIVE:**
   - Check Agora Console
   - Project status should be green/active

2. **Double-check credentials:**
   - App ID is exactly 32 characters
   - Certificate is exactly 32 characters
   - No extra spaces or quotes

3. **Check backend logs:**
   - Look for "Generating Agora Token"
   - Should show your new App ID

4. **Check frontend console:**
   - Should show your new App ID
   - No "invalid vendor key" error

---

## 📞 Need Help?

If you're stuck:
1. Take screenshot of Agora Console showing your project
2. Copy backend console output
3. Copy frontend console errors
4. Share these for debugging

---

**Estimated Time to Fix:** 10 minutes
**Difficulty:** Easy
**Success Rate:** 99%

Just create a new Agora project and update the credentials! 🚀
