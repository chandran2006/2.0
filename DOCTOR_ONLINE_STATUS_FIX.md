# Doctor Online Status - Complete Fix

## Issue Fixed
When doctor clicks "Online" toggle, the status now properly updates in:
1. Backend database (MySQL)
2. Call server (Socket.IO)
3. Patient's doctor list (real-time)

## Changes Made

### 1. Backend (Already Working)
- **CallController.java**: Has `/api/calls/doctor/online` and `/api/calls/doctor/offline` endpoints
- **UserService.java**: Has `updateAvailability()` method
- **User.java**: Has `isAvailable` field with default `false`
- **UserRepository.java**: Has `findByRoleAndIsAvailable()` method

### 2. Frontend - SchedulePage.tsx (FIXED)
**Before**: Switch toggle didn't call any API
**After**: 
- Calls backend API (`callAPI.doctorOnline()` or `callAPI.doctorOffline()`)
- Emits Socket.IO events (`doctor_online` or `doctor_offline`)
- Shows success/error toast notifications
- Properly handles user authentication

**Key Changes**:
```typescript
// Added imports
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { callAPI } from '@/services/api';
import io from 'socket.io-client';

// Added socket connection
const [socket, setSocket] = useState<any>(null);
useEffect(() => {
  const newSocket = io('http://localhost:5002');
  setSocket(newSocket);
  return () => newSocket.disconnect();
}, []);

// Added API call handler
const handleAvailabilityToggle = async (checked: boolean) => {
  // 1. Update backend database
  if (checked) {
    await callAPI.doctorOnline(user.id);
  } else {
    await callAPI.doctorOffline(user.id);
  }
  
  // 2. Update call server via socket
  if (checked) {
    socket.emit('doctor_online', {
      doctorId: user.id,
      name: user.name,
      specialization: user.specialization || 'General Physician',
    });
  } else {
    socket.emit('doctor_offline', { doctorId: user.id });
  }
  
  // 3. Update local state
  setIsAvailable(checked);
};
```

### 3. Call Server (Already Working)
- Listens for `doctor_online` and `doctor_offline` events
- Broadcasts `doctor_status_changed` to all connected clients
- Maintains `onlineDoctors` Map with doctor info

### 4. Patient DoctorsPage (Already Working)
- Connects to Socket.IO server
- Listens for `doctor_status_changed` events
- Updates doctor list in real-time
- Shows green pulsing dot for online doctors
- Shows "Call Now" button only for online doctors

## Testing Steps

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

### Step 2: Test Doctor Going Online
1. Login as doctor: `dr.sharma@teleasha.com` / `password123`
2. Navigate to "Schedule" page
3. Toggle "Online Status" switch to ON
4. Check console for:
   - ✅ "Doctor is now online" toast notification
   - ✅ Backend API call success
   - ✅ Socket event emitted

### Step 3: Verify Patient Sees Doctor Online
1. Open new browser window (incognito)
2. Login as patient: `patient1@teleasha.com` / `password123`
3. Navigate to "Find Doctors" page
4. Check that Dr. Sharma shows:
   - ✅ Green pulsing dot
   - ✅ "Online Now" text
   - ✅ "Call Now" button visible

### Step 4: Test Doctor Going Offline
1. Go back to doctor window
2. Toggle "Online Status" switch to OFF
3. Check patient window:
   - ✅ Green dot disappears
   - ✅ Shows "Offline" text
   - ✅ "Call Now" button hidden

### Step 5: Verify Database Persistence
1. Check MySQL database:
```sql
USE medora;
SELECT id, name, email, role, is_available FROM users WHERE role = 'DOCTOR';
```
2. Verify `is_available` column updates correctly

## API Endpoints

### Doctor Online
```http
POST http://localhost:8080/api/calls/doctor/online
Content-Type: application/json

{
  "doctorId": 2
}
```

### Doctor Offline
```http
POST http://localhost:8080/api/calls/doctor/offline
Content-Type: application/json

{
  "doctorId": 2
}
```

### Get Available Doctors
```http
GET http://localhost:8080/api/calls/doctors/available
```

## Socket.IO Events

### Emitted by Doctor (Frontend → Call Server)
- `doctor_online`: { doctorId, name, specialization }
- `doctor_offline`: { doctorId }

### Emitted by Call Server (Call Server → All Clients)
- `doctor_status_changed`: { doctorId, isOnline, name, specialization }
- `online_doctors_list`: [{ doctorId, name, specialization, socketId, timestamp }]

### Listened by Patient (Call Server → Frontend)
- `doctor_status_changed`: Updates doctor availability in real-time
- `online_doctors_list`: Initial list of online doctors on page load

## Troubleshooting

### Issue: "Failed to update status" error
**Solution**: 
- Check if backend server is running on port 8080
- Verify MySQL database is running
- Check user is logged in and has valid ID

### Issue: Patient doesn't see doctor online
**Solution**:
- Check if call server is running on port 5002
- Verify Socket.IO connection in browser console
- Refresh patient page to reconnect socket

### Issue: Status resets after page refresh
**Solution**:
- This is expected behavior (socket disconnects)
- Doctor needs to toggle online again after refresh
- Future enhancement: Auto-restore status from database

## Database Schema

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50),
  phone VARCHAR(50),
  address TEXT,
  specialization VARCHAR(255),
  license_number VARCHAR(255),
  pharmacy_name VARCHAR(255),
  is_available BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Success Indicators

✅ Doctor can toggle online/offline status
✅ Backend database updates immediately
✅ Call server receives socket events
✅ Patient sees real-time status updates
✅ Green pulsing dot shows for online doctors
✅ "Call Now" button appears only for online doctors
✅ Toast notifications confirm status changes
✅ Status persists in database

## Files Modified

1. `project/src/pages/doctor/SchedulePage.tsx` - Added API calls and socket events
2. No backend changes needed (already working)
3. No call-server changes needed (already working)
4. No patient page changes needed (already working)
