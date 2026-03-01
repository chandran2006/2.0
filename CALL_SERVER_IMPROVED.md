# 🎥 Call Server & Real-Time Doctor Status - Improved

## ✅ What Was Improved

### 1. Enhanced Call Server
**File:** `call-server/server.js`

**New Features:**
- ✅ Real-time doctor online/offline status tracking
- ✅ Patient connection tracking
- ✅ Active consultation monitoring
- ✅ Better error handling and logging
- ✅ REST API endpoints for status checking
- ✅ Automatic cleanup on disconnect
- ✅ Enhanced WebRTC signaling
- ✅ Emoji-based console logging for better visibility

### 2. Real-Time Doctor Status in Patient View
**File:** `project/src/pages/patient/DoctorsPage.tsx`

**New Features:**
- ✅ Live doctor online/offline status
- ✅ Automatic status updates (no refresh needed)
- ✅ "Call Now" button for online doctors
- ✅ Instant consultation requests
- ✅ Socket.IO integration
- ✅ Better visual indicators (pulsing green dot for online)

## 🚀 How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PATIENT (Frontend)                       │
│  - Views doctors list                                       │
│  - Sees real-time online status                            │
│  - Can call online doctors instantly                       │
└────────────────┬────────────────────────────────────────────┘
                 │ Socket.IO Connection
                 ↓
┌─────────────────────────────────────────────────────────────┐
│              CALL SERVER (Node.js + Socket.IO)              │
│  - Tracks online doctors                                    │
│  - Broadcasts status changes                                │
│  - Handles WebRTC signaling                                 │
│  - Manages consultations                                    │
└────────────────┬────────────────────────────────────────────┘
                 │ Socket.IO Connection
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                    DOCTOR (Frontend)                        │
│  - Goes online/offline                                      │
│  - Receives consultation requests                           │
│  - Accepts/rejects calls                                    │
└─────────────────────────────────────────────────────────────┘
```

### Flow Diagram

```
1. Doctor Opens Dashboard
   ↓
2. Doctor Clicks "Go Online"
   ↓
3. Socket emits 'doctor_online' → Call Server
   ↓
4. Call Server broadcasts 'doctor_status_changed' → All Patients
   ↓
5. Patient's DoctorsPage updates → Shows "Online Now" + Green Dot
   ↓
6. Patient Clicks "Call Now"
   ↓
7. Socket emits 'consultation_request' → Call Server → Doctor
   ↓
8. Doctor Accepts → Video call starts
```

## 📡 Socket Events

### Doctor Events

**Emit (Doctor → Server):**
```javascript
// Doctor goes online
socket.emit('doctor_online', {
  doctorId: 123,
  name: 'Dr. Sharma',
  specialization: 'Cardiology'
});

// Doctor goes offline
socket.emit('doctor_offline', {
  doctorId: 123
});

// Doctor accepts consultation
socket.emit('consultation_accepted', {
  consultationId: 'consult_123',
  doctorId: 123,
  patientId: 456,
  doctorName: 'Dr. Sharma'
});
```

**Listen (Server → Doctor):**
```javascript
// Receive consultation request
socket.on('consultation_request', (data) => {
  // data: { consultationId, patientId, patientName, reason }
});
```

### Patient Events

**Emit (Patient → Server):**
```javascript
// Patient goes online
socket.emit('patient_online', {
  patientId: 456,
  name: 'John Doe'
});

// Request consultation
socket.emit('consultation_request', {
  consultationId: 'consult_123',
  doctorId: 123,
  patientId: 456,
  patientName: 'John Doe',
  reason: 'Instant consultation'
});

// Get online doctors
socket.emit('get_online_doctors');
```

**Listen (Server → Patient):**
```javascript
// Doctor status changed
socket.on('doctor_status_changed', (data) => {
  // data: { doctorId, isOnline, name, specialization }
});

// Online doctors list
socket.on('online_doctors_list', (doctors) => {
  // doctors: [{ doctorId, name, specialization, socketId }]
});

// Consultation accepted
socket.on('consultation_accepted', (data) => {
  // data: { consultationId, roomId, doctorId, doctorName }
});
```

### WebRTC Events

```javascript
// Join video call room
socket.emit('join-room', {
  roomId: 'room_123',
  userId: 456,
  userName: 'John Doe',
  userType: 'patient' // or 'doctor'
});

// WebRTC offer
socket.emit('offer', {
  roomId: 'room_123',
  offer: rtcOffer,
  userId: 456
});

// WebRTC answer
socket.emit('answer', {
  roomId: 'room_123',
  answer: rtcAnswer,
  userId: 123
});

// ICE candidate
socket.emit('ice-candidate', {
  roomId: 'room_123',
  candidate: iceCandidate,
  userId: 456
});

// End call
socket.emit('end-call', {
  roomId: 'room_123',
  userId: 456,
  reason: 'Call ended'
});
```

## 🎯 Features

### 1. Real-Time Status Updates
- Doctor goes online → All patients see "Online Now" immediately
- Doctor goes offline → Status updates to "Offline" instantly
- No page refresh needed
- Pulsing green dot for online doctors

### 2. Instant Consultation
- "Call Now" button appears for online doctors
- Click to send consultation request
- Doctor receives notification
- Doctor can accept/reject
- Video call starts automatically

### 3. Better Logging
```
🚀 ========================================
🏥 MeDora Call Server Started
📡 Port: 5002
🌐 Health: http://localhost:5002/health
👨‍⚕️ Online Doctors: http://localhost:5002/api/online-doctors
🚀 ========================================

✅ Client connected: abc123
👨‍⚕️ Doctor online: Dr. Sharma (ID: 123)
📊 Total online doctors: 1
👤 Patient online: John Doe (ID: 456)
📞 Consultation request: John Doe → Dr. Sharma
✅ Consultation accepted: consult_123
🎥 patient John Doe joined room consultation_123
📤 Offer sent in room consultation_123
📥 Answer sent in room consultation_123
📴 Call ended in room consultation_123
❌ Client disconnected: abc123
```

### 4. REST API Endpoints

**Health Check:**
```bash
GET http://localhost:5002/health
```
Response:
```json
{
  "status": "healthy",
  "uptime": 12345,
  "onlineDoctors": 3,
  "onlinePatients": 5,
  "activeConsultations": 2,
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

**Online Doctors:**
```bash
GET http://localhost:5002/api/online-doctors
```
Response:
```json
{
  "doctors": [
    {
      "doctorId": 123,
      "name": "Dr. Sharma",
      "specialization": "Cardiology",
      "onlineSince": "2024-01-01T09:30:00.000Z"
    }
  ]
}
```

**Active Consultations:**
```bash
GET http://localhost:5002/api/active-consultations
```
Response:
```json
{
  "consultations": [
    {
      "patientId": 456,
      "doctorId": 123,
      "roomId": "consultation_789",
      "startTime": 1234567890
    }
  ]
}
```

## 🧪 Testing

### Step 1: Start Call Server
```bash
cd call-server
npm install
npm start
```

**Expected Output:**
```
🚀 ========================================
🏥 MeDora Call Server Started
📡 Port: 5002
🌐 Health: http://localhost:5002/health
👨‍⚕️ Online Doctors: http://localhost:5002/api/online-doctors
🚀 ========================================
```

### Step 2: Test Health Endpoint
Open browser: http://localhost:5002/health

Should see:
```json
{
  "status": "healthy",
  "onlineDoctors": 0,
  "onlinePatients": 0
}
```

### Step 3: Start Backend & Frontend
```bash
# Terminal 1: Backend
cd projectbackend
mvnw spring-boot:run

# Terminal 2: Frontend
cd project
npm run dev
```

### Step 4: Test Doctor Online Status

**As Doctor:**
1. Login as doctor (dr.sharma@teleasha.com / password123)
2. Go to dashboard
3. Click "Go Online" button
4. Check call server console → Should see "👨‍⚕️ Doctor online"

**As Patient:**
1. Login as patient (patient1@teleasha.com / password123)
2. Go to "Find Doctors" page
3. Should see Dr. Sharma with:
   - Green pulsing dot
   - "Online Now" text
   - "Call Now" button

### Step 5: Test Real-Time Updates

**Keep both windows open:**
1. Patient window: Find Doctors page
2. Doctor window: Dashboard

**Test:**
1. Doctor clicks "Go Offline"
2. Patient window updates immediately → Shows "Offline"
3. Doctor clicks "Go Online"
4. Patient window updates immediately → Shows "Online Now"

**No refresh needed!** ✅

### Step 6: Test Instant Consultation

1. Patient clicks "Call Now" on online doctor
2. Alert shows: "Consultation request sent"
3. Doctor receives notification
4. Doctor accepts
5. Video call starts

## 🔧 Configuration

### Call Server Port
**File:** `call-server/server.js`
```javascript
const PORT = 5002; // Change if needed
```

### Frontend Socket URL
**File:** `project/.env`
```
VITE_SOCKET_URL=http://localhost:5002
```

### CORS Origins
**File:** `call-server/server.js`
```javascript
cors: {
  origin: ['http://localhost:5173', 'http://localhost:8080'],
  methods: ['GET', 'POST'],
  credentials: true
}
```

## 🐛 Troubleshooting

### Issue: Doctor status not updating

**Check:**
1. Call server is running on port 5002
2. Frontend .env has correct VITE_SOCKET_URL
3. Browser console for socket connection errors
4. Call server console for connection logs

**Fix:**
```bash
# Restart call server
cd call-server
npm start

# Check browser console (F12)
# Should see: "Socket connected"
```

### Issue: "Call Now" button not appearing

**Cause:** Doctor not marked as online in call server

**Fix:**
1. Doctor must click "Go Online" in dashboard
2. Check call server console for "Doctor online" message
3. Check backend database: `SELECT * FROM users WHERE role='DOCTOR';`
4. Verify `isAvailable` field is true

### Issue: Socket connection failed

**Check:**
1. Call server running: `netstat -ano | findstr :5002`
2. CORS configured correctly
3. No firewall blocking port 5002

**Fix:**
```bash
# Windows: Allow port 5002
netsh advfirewall firewall add rule name="Call Server" dir=in action=allow protocol=TCP localport=5002
```

### Issue: Status updates delayed

**Cause:** Socket not connected or network latency

**Fix:**
1. Check network connection
2. Restart call server
3. Clear browser cache
4. Check for console errors

## 📊 Monitoring

### Call Server Console
Watch for:
- ✅ Client connections
- 👨‍⚕️ Doctor online/offline
- 👤 Patient connections
- 📞 Consultation requests
- 🎥 Room joins
- ❌ Disconnections

### Browser Console (F12)
Watch for:
- Socket connection status
- Doctor status changes
- Online doctors list
- Consultation events

### Backend Console
Watch for:
- Doctor availability updates
- API calls to /api/calls/doctor/online
- Database updates

## 🎉 Benefits

### For Patients:
- ✅ See which doctors are available right now
- ✅ Instant consultation with online doctors
- ✅ No waiting for appointment approval
- ✅ Real-time status updates

### For Doctors:
- ✅ Control availability status
- ✅ Receive instant consultation requests
- ✅ Better patient engagement
- ✅ Flexible working hours

### For System:
- ✅ Reduced server load (WebSocket vs polling)
- ✅ Real-time communication
- ✅ Better user experience
- ✅ Scalable architecture

## 📝 Next Steps (Optional Enhancements)

1. **Add Video Call UI**
   - Create VideoCallPage component
   - Implement WebRTC peer connection
   - Add camera/microphone controls

2. **Add Notifications**
   - Browser notifications for consultation requests
   - Sound alerts for incoming calls
   - Toast notifications for status changes

3. **Add Chat Feature**
   - Text chat during video calls
   - File sharing
   - Prescription sharing

4. **Add Call History**
   - Store call records in database
   - Show call duration
   - Add call ratings

5. **Add Queue System**
   - Queue patients when doctor is busy
   - Estimated wait time
   - Auto-connect when available

## ✅ Summary

**Improved:**
- ✅ Call server with better tracking
- ✅ Real-time doctor status in patient view
- ✅ Instant consultation feature
- ✅ Better logging and monitoring
- ✅ REST API endpoints
- ✅ Enhanced WebRTC signaling

**Status:** Ready to use! 🎉

**Test:** Start all three servers and see real-time doctor status updates!
