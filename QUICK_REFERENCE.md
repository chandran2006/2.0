# MeDora - Quick Reference Card

## 🚀 Quick Start
```bash
# Double-click this file:
START_ALL.bat

# Or run manually:
cd projectbackend && mvnw.cmd spring-boot:run    # Terminal 1
cd project && npm install && npm run dev          # Terminal 2
cd call-server && npm install && npm start        # Terminal 3
```

## 🌐 URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Call Server: http://localhost:5002
- H2 Console: http://localhost:8080/h2-console

## 🔑 Demo Logins
| Role | Email | Password |
|------|-------|----------|
| Patient | patient1@teleasha.com | password123 |
| Doctor | dr.sharma@teleasha.com | password123 |
| Pharmacy | pharmacy@teleasha.com | pharmacy123 |
| Admin | admin@teleasha.com | admin123 |

## 📡 Key API Endpoints

### Authentication
```bash
POST /api/auth/login
POST /api/auth/register
```

### Appointments
```bash
GET  /api/appointments/doctors
POST /api/appointments/book
GET  /api/appointments/patient/{id}
PUT  /api/appointments/{id}/approve
```

### Prescriptions
```bash
POST /api/prescriptions/create
GET  /api/prescriptions/patient/{id}
PUT  /api/prescriptions/{id}/mark-taken
```

### Medicines
```bash
GET  /api/medicines/search?q={query}
POST /api/medicines/create
PUT  /api/medicines/{id}/update-stock
```

### Calls
```bash
POST /api/calls/initiate
POST /api/calls/doctor/online
GET  /api/calls/doctors/available
```

## 🎯 User Flows

### Patient Flow
1. Login → Dashboard
2. View health metrics
3. Book appointment
4. View prescriptions
5. Search medicines

### Doctor Flow
1. Login → Dashboard
2. Toggle Online status
3. View appointment requests
4. Approve appointments
5. Create prescriptions

### Pharmacy Flow
1. Login → Dashboard
2. View inventory
3. Add medicines
4. Update stock
5. View prescriptions

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8080 (Backend)
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Kill process on port 5173 (Frontend)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Backend Won't Start
- Check Java version: `java -version` (need 17+)
- Check JAVA_HOME is set
- Delete target folder and rebuild

### Frontend Won't Start
- Delete node_modules: `rm -rf node_modules`
- Reinstall: `npm install`
- Clear cache: `npm cache clean --force`

## 📊 Database (H2)
- URL: jdbc:h2:mem:medora
- Username: sa
- Password: (empty)
- Console: http://localhost:8080/h2-console

## 🔧 Tech Stack
**Backend**: Java 17, Spring Boot 3.5.5, JPA, H2
**Frontend**: React 18, TypeScript, Vite, TailwindCSS
**Real-time**: Node.js, Socket.IO, WebRTC

## 📁 Project Structure
```
2.0/
├── projectbackend/    # Spring Boot (Port 8080)
├── project/           # React (Port 5173)
├── call-server/       # Node.js (Port 5002)
└── START_ALL.bat      # Run all services
```

## ✅ Features Checklist
- [x] User Authentication
- [x] Role-based Dashboards
- [x] Appointment Management
- [x] Prescription System
- [x] Medicine Inventory
- [x] Real-time Communication
- [x] Doctor Availability
- [x] Health Metrics Display

## 📞 Need Help?
1. Check `SETUP_GUIDE.md`
2. Review `PROJECT_SUMMARY.md`
3. Check terminal logs
4. Verify prerequisites with `CHECK_PREREQUISITES.bat`

---
**Version**: 1.0.0 | **Status**: Production Ready
