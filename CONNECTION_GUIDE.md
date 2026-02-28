# Frontend-Backend Connection Guide

## ✅ Improvements Made

### 1. **API Integration Layer**
- ✅ Created `src/services/api.ts` - Complete REST API service
- ✅ Created `src/services/socket.ts` - WebSocket service for real-time features
- ✅ Updated `AuthContext.tsx` - Now uses real backend API instead of mock data

### 2. **Configuration Fixes**
- ✅ Fixed `vite.config.ts` - Changed port from 8080 to 5173
- ✅ Created `.env` - Environment variables for API and Socket URLs
- ✅ Added `axios` and `socket.io-client` to dependencies

### 3. **Backend Ready**
- ✅ CORS configured for frontend (port 5173) and call-server (port 5002)
- ✅ Security configured (CSRF disabled for development)
- ✅ Sample data initialized (4 demo users + medicines)
- ✅ WebSocket configured for real-time features

## 🚀 Setup Instructions

### Step 1: Install Frontend Dependencies
```bash
cd project
npm install
```

### Step 2: Start Backend (Terminal 1)
```bash
cd projectbackend
mvnw spring-boot:run
```
Backend will run on: http://localhost:8080

### Step 3: Start Call Server (Terminal 2)
```bash
cd call-server
npm install
npm start
```
Call server will run on: http://localhost:5002

### Step 4: Start Frontend (Terminal 3)
```bash
cd project
npm run dev
```
Frontend will run on: http://localhost:5173

## 🔗 Connection Architecture

```
Frontend (React - Port 5173)
    ↓
    ├─→ REST API → Backend (Spring Boot - Port 8080)
    │                ↓
    │            H2 Database (In-Memory)
    │
    └─→ WebSocket → Call Server (Node.js - Port 5002)
                        ↓
                    WebRTC Signaling
```

## 📡 API Endpoints Available

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- GET `/api/auth/current-user/{id}` - Get current user

### Appointments
- GET `/api/appointments/doctors` - Get all doctors
- POST `/api/appointments/book` - Book appointment
- GET `/api/appointments/patient/{id}` - Get patient appointments
- GET `/api/appointments/doctor/{id}` - Get doctor appointments
- PUT `/api/appointments/{id}/approve` - Approve appointment
- PUT `/api/appointments/{id}/cancel` - Cancel appointment

### Prescriptions
- POST `/api/prescriptions/create` - Create prescription
- GET `/api/prescriptions/patient/{id}` - Get patient prescriptions
- GET `/api/prescriptions/doctor/{id}` - Get doctor prescriptions

### Medicines
- GET `/api/medicines/search?q={query}` - Search medicines
- GET `/api/medicines` - Get all medicines
- POST `/api/medicines/create` - Add medicine

### Calls
- POST `/api/calls/initiate` - Start call
- POST `/api/calls/doctor/online` - Doctor goes online
- POST `/api/calls/doctor/offline` - Doctor goes offline
- GET `/api/calls/doctors/available` - Get available doctors

## 🔌 WebSocket Events

### Doctor Availability
- `doctor_online` - Doctor comes online
- `doctor_offline` - Doctor goes offline

### Consultations
- `consultation_request` - Patient requests consultation
- `consultation_accepted` - Doctor accepts consultation
- `consultation_rejected` - Doctor rejects consultation

### WebRTC Signaling
- `join-room` - Join video call room
- `offer` - WebRTC offer
- `answer` - WebRTC answer
- `ice-candidate` - ICE candidate exchange
- `end-call` - End call

## 🧪 Test the Connection

### 1. Test Backend Health
```bash
curl http://localhost:8080/api/test
```

### 2. Test Login API
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient1@teleasha.com","password":"password123"}'
```

### 3. Test Call Server
```bash
curl http://localhost:5002/health
```

## 👥 Demo Accounts

| Role     | Email                      | Password     |
|----------|----------------------------|--------------|
| Patient  | patient1@teleasha.com      | password123  |
| Doctor   | dr.sharma@teleasha.com     | password123  |
| Pharmacy | pharmacy@teleasha.com      | pharmacy123  |
| Admin    | admin@teleasha.com         | admin123     |

## 🔧 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:5002
```

### Backend (application.properties)
```
server.port=8080
spring.datasource.url=jdbc:h2:mem:medora
```

### Call Server
```
PORT=5002
```

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend is running on port 8080
- Check CORS configuration in `CorsConfig.java`
- Verify frontend is on port 5173

### Connection Refused
- Check all three servers are running
- Verify ports are not in use by other applications
- Check firewall settings

### WebSocket Not Connecting
- Ensure call-server is running on port 5002
- Check browser console for errors
- Verify CORS settings in call-server

## 📝 Next Steps

1. **Install dependencies**: Run `npm install` in project folder
2. **Start all servers**: Use the provided commands
3. **Test login**: Use demo accounts to verify connection
4. **Check console**: Monitor browser console for API calls
5. **Verify data**: Check H2 console at http://localhost:8080/h2-console

## 🎯 Key Improvements Summary

- ✅ Frontend now connects to real backend API
- ✅ Authentication uses backend database
- ✅ All CRUD operations ready for appointments, prescriptions, medicines
- ✅ WebSocket ready for real-time features
- ✅ Environment configuration properly set up
- ✅ CORS properly configured across all services
- ✅ Demo data automatically initialized on backend startup
