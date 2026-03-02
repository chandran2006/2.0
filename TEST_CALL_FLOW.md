# 🧪 Test Call Request Flow - Quick Guide

## Prerequisites
- All 3 servers running (Backend, Frontend, Call Server)
- 2 browser windows/tabs or incognito mode

## Step-by-Step Test

### 1. Start All Servers
```bash
# Terminal 1 - Backend
cd projectbackend
mvnw spring-boot:run

# Terminal 2 - Frontend
cd project
npm run dev

# Terminal 3 - Call Server
cd call-server
npm start
```

### 2. Login as Doctor
- Open browser: http://localhost:5173
- Login: dr.sharma@teleasha.com / password123
- Toggle "Online" switch to ON
- Keep this window open

### 3. Login as Patient
- Open new browser window/incognito
- Go to: http://localhost:5173
- Login: patient1@teleasha.com / password123
- Navigate to dashboard

### 4. Initiate Call
- Patient: Click "Video Consultation" or find online doctor
- Patient: Click "Call" button next to doctor name
- Patient: See "Call request sent..." message

### 5. Doctor Receives Notification
- Doctor window: See popup notification top-right
- Shows: "Incoming Call from [Patient Name]"
- Two buttons: Accept / Decline

### 6. Accept Call
- Doctor: Click "Accept" button
- Both windows: Navigate to video call page
- Both: See local and remote video streams

### 7. End Call
- Either user: Click red phone icon
- Both: Return to dashboard

## Expected Results

✅ Patient sees waiting message
✅ Doctor sees notification popup
✅ On accept: Both join video call
✅ Video/audio streams work
✅ Call can be ended by either party

## Troubleshooting

**Doctor not receiving notification?**
- Check doctor is online (toggle switch)
- Check call server console for logs
- Refresh doctor page

**Video not working?**
- Allow camera/microphone permissions
- Check browser console for errors
- Try different browser

**Call not connecting?**
- Check all 3 servers running
- Check WebSocket connection in Network tab
- Check call server logs

## Console Logs to Check

**Call Server:**
```
📞 Consultation request: [Patient] → Dr. [Doctor]
✅ Consultation accepted: Call [ID] - Room [UUID]
```

**Backend:**
```
Doctor going online: [ID]
Call initiated
Call accepted
```

**Browser Console:**
```
Incoming consultation request: {...}
Call accepted! Joining video call...
```
