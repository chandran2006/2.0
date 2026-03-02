# Troubleshooting: "Failed to Start Conversation" Error

## Quick Checklist

### 1. Verify Call Server is Running
```bash
cd call-server
npm start
```
Expected output:
```
🚀 ========================================
🏥 MeDora Call Server Started
📡 Port: 5002
🌐 Health: http://localhost:5002/health
👨⚕️ Online Doctors: http://localhost:5002/api/online-doctors
🚀 ========================================
```

Test health endpoint:
```bash
curl http://localhost:5002/health
```

### 2. Check Browser Console (Patient Side)

Open browser console (F12) and look for:
```
✅ Patient connected to call server, socket ID: [some-id]
✅ Patient registered: [patient-id] [patient-name]
📞 Sending consultation request: { roomId, doctorId, patientId, socketConnected: true }
✅ Consultation request sent to doctor: [doctor-id]
```

If you see:
```
❌ Socket not connected
```
→ Call server is not running or not accessible

### 3. Check Browser Console (Doctor Side)

Open browser console (F12) on doctor's Consultation Requests page:
```
👨⚕️ Doctor connecting to call server...
✅ Doctor connected to call server, socket ID: [some-id]
📡 Registering doctor online: [doctor-id] [doctor-name]
✅ Consultation request received: { consultationId, patientId, patientName, reason }
```

If doctor doesn't receive the request:
- Doctor is not on Consultation Requests page
- Doctor's socket is not connected
- Doctor ID mismatch

### 4. Check Call Server Logs

Terminal running call-server should show:
```
✅ Client connected: [socket-id]
👨⚕️ Doctor online: Dr. Sharma (ID: 2)
📊 Total online doctors: 1
✅ Client connected: [socket-id]
👤 Patient online: Patient Name (ID: 1)
📞 Consultation request: Patient Name → Dr. Sharma
```

If you see:
```
❌ Consultation request failed: Doctor [id] not online
```
→ Doctor is not registered as online in call server

## Common Issues & Solutions

### Issue 1: Socket Connection Failed
**Symptoms:** 
- "Not connected to call server" error
- Console shows connection errors

**Solution:**
1. Ensure call server is running on port 5002
2. Check if port 5002 is not blocked by firewall
3. Verify CORS settings in call-server/server.js

### Issue 2: Doctor Not Receiving Notification
**Symptoms:**
- Patient sends request successfully
- Doctor doesn't see notification

**Solution:**
1. Doctor must be on "Consultation Requests" page
2. Doctor must toggle "Online Status" to ON in Schedule page
3. Check call server logs to verify doctor is registered
4. Verify doctor ID matches in both frontend and backend

### Issue 3: Doctor Shows Offline
**Symptoms:**
- Doctor toggled online but still shows offline to patient

**Solution:**
1. Check Schedule page - toggle should be ON
2. Check browser console for "doctor_online" event
3. Verify call server received the event
4. Patient should see "Online Now" badge

### Issue 4: Request Timeout
**Symptoms:**
- Request sent but no response after 30 seconds

**Solution:**
1. Doctor must accept/reject within 30 seconds
2. Check if doctor is actually on Consultation Requests page
3. Verify socket connection on both sides

## Step-by-Step Testing

### Terminal 1: Start Backend
```bash
cd projectbackend
mvnw spring-boot:run
```
Wait for: "Started ProjectbackendApplication"

### Terminal 2: Start Call Server
```bash
cd call-server
npm start
```
Wait for: "🏥 MeDora Call Server Started"

### Terminal 3: Start Frontend
```bash
cd project
npm run dev
```
Wait for: "Local: http://localhost:5173"

### Browser 1: Doctor Login
1. Open http://localhost:5173
2. Login: dr.sharma@teleasha.com / password123
3. Go to Schedule page
4. Toggle "Online Status" to ON
5. Go to "Consultation Requests" page
6. Open browser console (F12)
7. Verify: "✅ Doctor connected to call server"

### Browser 2: Patient Login (Incognito/Different Browser)
1. Open http://localhost:5173 (incognito mode)
2. Login: patient1@teleasha.com / password123
3. Go to "Find Doctors" page
4. Open browser console (F12)
5. Verify: "✅ Patient connected to call server"
6. Find Dr. Sharma - should show "Online Now" badge
7. Click "Call Now"
8. Verify console: "📞 Sending consultation request"

### Expected Result:
- Doctor's browser shows notification
- Doctor's page shows request card
- Toast notification appears
- Sound plays (if not muted)

## Debug Commands

### Check Online Doctors
```bash
curl http://localhost:5002/api/online-doctors
```

### Check Call Server Health
```bash
curl http://localhost:5002/health
```

### Check Backend Health
```bash
curl http://localhost:8080/actuator/health
```

## Still Not Working?

1. **Clear browser cache and reload**
2. **Check all three servers are running**
3. **Verify no port conflicts (5002, 5173, 8080)**
4. **Check browser console for errors**
5. **Check call server terminal for errors**
6. **Try different browsers**
7. **Restart all servers**

## Console Commands for Testing

### In Patient's Browser Console:
```javascript
// Check socket connection
console.log('Socket connected:', socket?.connected);

// Manually emit request (if socket exists)
socket.emit('consultation_request', {
  consultationId: 'test_123',
  doctorId: 2,
  patientId: 1,
  patientName: 'Test Patient',
  reason: 'Test'
});
```

### In Doctor's Browser Console:
```javascript
// Check socket connection
console.log('Socket connected:', socket?.connected);

// Check if listening for requests
socket.listeners('consultation_request');
```

## Error Messages & Meanings

| Error | Meaning | Solution |
|-------|---------|----------|
| "Not connected to call server" | Socket not connected | Start call server |
| "Doctor is currently offline" | Doctor not online | Doctor toggle online in Schedule |
| "Failed to connect to call server" | Call server not running | Start call server on port 5002 |
| "Request Timeout" | No response in 30s | Doctor must be on Consultation Requests page |
| "Doctor is not available" | Doctor not in online list | Doctor must emit doctor_online event |

## Success Indicators

✅ Call server running on port 5002
✅ Doctor shows "Online Now" badge
✅ Patient socket connected
✅ Doctor socket connected
✅ Doctor on Consultation Requests page
✅ Console shows "Consultation request sent"
✅ Doctor receives notification
✅ Request card appears on doctor's page
