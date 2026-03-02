# Complete Call Flow - Testing Guide

## 🎯 How the Call System Works

### Flow:
1. **Patient** clicks "Call Now" on online doctor
2. **Request sent** via Socket.IO to call server
3. **Doctor** sees request in Consultation Requests page
4. **Doctor** clicks "Accept Call"
5. **Both** automatically navigate to video call page
6. **Video call** starts with WebRTC

## 🚀 Step-by-Step Testing

### Step 1: Start All Servers
```bash
# Terminal 1 - Backend
cd projectbackend
mvnw spring-boot:run

# Terminal 2 - Call Server
cd call-server
npm start

# Terminal 3 - Frontend
cd project
npm run dev
```

### Step 2: Doctor Setup
1. Open browser: http://localhost:5173
2. Login: `dr.sharma@teleasha.com` / `password123`
3. Go to **Schedule** page
4. Toggle **Online Status** to ON (should stay ON after refresh)
5. Go to **Consultations** page
6. Click **View Requests** button
7. Keep this page open

### Step 3: Patient Initiates Call
1. Open NEW browser window (incognito): http://localhost:5173
2. Login: `patient1@teleasha.com` / `password123`
3. Go to **Find Doctors** page
4. Find Dr. Sharma - should show:
   - ✅ Green pulsing dot
   - ✅ "Online Now" text
   - ✅ Green "Call Now" button
5. Click **"Call Now"** button
6. See toast: "Request Sent - Waiting for doctor to accept..."

### Step 4: Doctor Accepts Call
1. Go back to doctor window (Consultation Requests page)
2. Should see new request card with:
   - Patient name
   - "Instant consultation request"
   - Timestamp
3. Click **"Accept Call"** button
4. See toast: "Call Accepted - Connecting to patient..."
5. Page automatically redirects to `/call?room=...`

### Step 5: Patient Joins Call
1. Patient window automatically redirects to call page
2. Browser asks for camera/microphone permission - **ALLOW**
3. Both users should see:
   - Their own video (bottom right)
   - Remote user video (main screen)

### Step 6: During Call
**Controls:**
- 📹 Video button - Toggle camera on/off
- 🎤 Mic button - Toggle microphone on/off
- 📞 Red phone button - End call

**Test:**
1. Toggle video off/on
2. Toggle mic off/on
3. Check if remote user sees changes
4. Click end call - returns to dashboard

## 🔍 What to Check

### Patient Side:
✅ Doctor shows green dot when online
✅ "Call Now" button appears
✅ Toast shows "Request Sent"
✅ Automatically redirects to call page when accepted
✅ Can see doctor's video
✅ Can toggle camera/mic

### Doctor Side:
✅ Online toggle persists after refresh
✅ Request appears in Consultation Requests page
✅ Shows patient name and timestamp
✅ Automatically redirects to call page when accepted
✅ Can see patient's video
✅ Can toggle camera/mic

### Call Server Console:
✅ Shows "Doctor online: Dr. Sharma"
✅ Shows "Patient online: Patient Name"
✅ Shows "Consultation request: Patient → Dr. Sharma"
✅ Shows "Consultation accepted"
✅ Shows "User joined room"

## 🐛 Troubleshooting

### Issue: Doctor not showing online
**Fix:** 
- Refresh patient page
- Check call server is running
- Check backend console for errors

### Issue: Request not appearing
**Fix:**
- Check call server console
- Verify doctor is on Consultation Requests page
- Refresh doctor page

### Issue: Camera/Mic not working
**Fix:**
- Allow browser permissions
- Check if another app is using camera
- Try in Chrome/Edge (best WebRTC support)

### Issue: Video not connecting
**Fix:**
- Check both users are on call page
- Check browser console for errors
- Verify call server is running

### Issue: Call page shows black screen
**Fix:**
- Allow camera/mic permissions
- Check camera is not used by another app
- Try refreshing the page

## 📝 Expected Console Logs

### Patient Console:
```
Updating doctor status: { doctorId: 2, checked: true }
Doctor status changed: { doctorId: 2, isOnline: true }
Consultation request sent
```

### Doctor Console:
```
Loaded doctor status from DB: true
Synced online status with socket server
Consultation request received: { patientName: "..." }
```

### Call Server Console:
```
👨‍⚕️ Doctor online: Dr. Sharma (ID: 2)
👤 Patient online: Patient Name (ID: 1)
📞 Consultation request: Patient Name → Dr. Sharma
✅ Consultation accepted: call_1_2_...
🎥 patient Patient Name joined room call_1_2_...
🎥 doctor Dr. Sharma joined room call_1_2_...
```

## ✅ Success Checklist

- [ ] Backend running on port 8080
- [ ] Call server running on port 5002
- [ ] Frontend running on port 5173
- [ ] Doctor can toggle online status
- [ ] Patient sees green dot for online doctor
- [ ] Patient can click "Call Now"
- [ ] Doctor receives request notification
- [ ] Doctor can accept/reject request
- [ ] Both users redirect to call page
- [ ] Video call connects successfully
- [ ] Camera/mic controls work
- [ ] End call returns to dashboard

## 🎉 Ready to Test!

Follow the steps above to test the complete call flow from patient request to video call!
