# 📋 MeDora - Quick Reference Guide

## 🎯 Project Overview

**MeDora** is a comprehensive **TeleMedicine Platform** connecting patients with healthcare providers through digital consultations, appointment management, prescriptions, and medicine delivery.

---

## 🏗️ System Components

| Component | Technology | Port | Purpose |
|-----------|-----------|------|---------|
| **Frontend** | React 18 + TypeScript + Vite | 5173 | User Interface |
| **Backend** | Spring Boot 3.5 + Java 17 | 8080 | REST API Server |
| **Call Server** | Node.js + Socket.IO | 5002 | Real-time Video Calls |
| **Database** | MySQL 8.0 | 3306 | Data Storage |

---

## 👥 User Roles & Features

### 🩺 PATIENT
- Book appointments with doctors
- Instant video consultations
- View prescriptions
- Search medicines
- Find nearby pharmacies
- Upload health records
- Symptom checker

### 👨‍⚕️ DOCTOR
- View/approve appointments
- Accept instant consultations
- Video/audio consultations
- Create prescriptions
- View patient history
- Manage availability

### 💊 PHARMACY
- Manage medicine inventory
- Process prescription orders
- Track stock levels
- View sales analytics
- Update pharmacy details

### 🛡️ ADMIN
- User management (CRUD)
- System analytics
- Generate reports
- Monitor system health
- Manage medicines & pharmacies

---

## 🗄️ Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| **users** | User accounts | email, password, role, name, phone |
| **appointments** | Appointment bookings | patientId, doctorId, date, status |
| **prescriptions** | Medical prescriptions | patientId, doctorId, medicine, dosage |
| **medicines** | Medicine catalog | name, category, price, stock |
| **pharmacies** | Pharmacy locations | name, address, lat/lng, rating |
| **calls** | Call history | patientId, doctorId, duration, status |
| **health_records** | Patient medical records | patientId, type, file_url |
| **doctor_availability** | Doctor schedules | doctorId, day, start_time, end_time |
| **reports** | Analytics reports | type, generated_by, data |

---

## 🔌 Key API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - User login
GET    /api/auth/current-user/:id - Get current user
```

### Appointments
```
GET    /api/appointments/doctors - Get all doctors
POST   /api/appointments/book - Book appointment
GET    /api/appointments/patient/:id - Get patient appointments
GET    /api/appointments/doctor/:id - Get doctor appointments
PUT    /api/appointments/:id/approve - Approve appointment
PUT    /api/appointments/:id/cancel - Cancel appointment
```

### Prescriptions
```
POST   /api/prescriptions/create - Create prescription
GET    /api/prescriptions/patient/:id - Get patient prescriptions
GET    /api/prescriptions/doctor/:id - Get doctor prescriptions
PUT    /api/prescriptions/:id/status - Update prescription status
```

### Medicines
```
GET    /api/medicines/search?q=query - Search medicines
GET    /api/medicines - Get all medicines
POST   /api/medicines/create - Add medicine
PUT    /api/medicines/:id - Update medicine
```

### Pharmacies
```
GET    /api/pharmacies - Get all pharmacies
GET    /api/pharmacies/nearby?lat&lng - Get nearby pharmacies
```

### Calls
```
POST   /api/calls/initiate - Initiate video call
POST   /api/calls/doctor/online - Mark doctor online
POST   /api/calls/doctor/offline - Mark doctor offline
GET    /api/calls/doctors/available - Get available doctors
```

---

## 🎥 WebSocket Events (Call Server)

### Doctor Events
```javascript
doctor_online        - Doctor marks available
doctor_offline       - Doctor goes offline
get_online_doctors   - Request online doctors list
```

### Patient Events
```javascript
patient_online           - Patient connects
consultation_request     - Request instant consultation
```

### Call Events
```javascript
join-room           - Join video call room
leave-room          - Leave video call room
offer               - WebRTC offer
answer              - WebRTC answer
ice-candidate       - ICE candidate exchange
call-ended          - Call terminated
```

---

## 🚀 Quick Start Commands

### Start All Services
```bash
# Windows (Recommended)
START_ALL.bat

# Manual Start
# Terminal 1: Backend
cd projectbackend
mvnw spring-boot:run

# Terminal 2: Frontend
cd project
npm run dev

# Terminal 3: Call Server
cd call-server
npm start
```

### Access URLs
```
Frontend:  http://localhost:5173
Backend:   http://localhost:8080
Call Server: http://localhost:5002
MySQL:     localhost:3306
```

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Patient** | patient1@teleasha.com | password123 |
| **Doctor** | dr.sharma@teleasha.com | password123 |
| **Pharmacy** | pharmacy@teleasha.com | pharmacy123 |
| **Admin** | admin@teleasha.com | admin123 |

---

## 📦 Technology Stack Summary

### Frontend Dependencies
```json
{
  "react": "18.3.1",
  "typescript": "5.8.3",
  "vite": "5.4.19",
  "tailwindcss": "3.4.17",
  "axios": "1.7.2",
  "socket.io-client": "4.7.2",
  "react-router-dom": "6.30.1",
  "@tanstack/react-query": "5.83.0",
  "react-hook-form": "7.61.1",
  "zod": "3.25.76"
}
```

### Backend Dependencies
```xml
<dependencies>
  <spring-boot-starter-web>3.5.5</spring-boot-starter-web>
  <spring-boot-starter-data-jpa>3.5.5</spring-boot-starter-data-jpa>
  <spring-boot-starter-security>3.5.5</spring-boot-starter-security>
  <spring-boot-starter-websocket>3.5.5</spring-boot-starter-websocket>
  <mysql-connector-j>Latest</mysql-connector-j>
</dependencies>
```

### Call Server Dependencies
```json
{
  "express": "4.18.2",
  "socket.io": "4.7.2",
  "cors": "2.8.5"
}
```

---

## 🔐 Security Summary

### Authentication
- Spring Security with BCrypt password hashing
- Session-based authentication
- Role-based access control (RBAC)

### Authorization
- `@PreAuthorize` annotations on controllers
- Route guards on frontend
- Protected API endpoints

### CORS Configuration
```java
Allowed Origins: http://localhost:5173
Allowed Methods: GET, POST, PUT, DELETE
Allowed Headers: *
Credentials: true
```

---

## 🔥 Firebase Migration Checklist

When migrating to Firebase:

- [ ] Create Firebase project
- [ ] Enable Firebase Authentication (Email/Password)
- [ ] Setup Firestore database
- [ ] Define Firestore security rules
- [ ] Create Cloud Functions for backend logic
- [ ] Implement Realtime Database for presence
- [ ] Setup Agora SDK for video calls
- [ ] Deploy to Firebase Hosting
- [ ] Configure custom domain (optional)
- [ ] Setup Firebase Analytics

### Firebase Services Mapping

| Current | Firebase Equivalent |
|---------|-------------------|
| Spring Boot API | Cloud Functions |
| MySQL | Firestore |
| Spring Security | Firebase Auth |
| Socket.IO (presence) | Realtime Database |
| Local Storage | Cloud Storage |
| Custom WebRTC | Agora/Twilio |

---

## 📊 Database Configuration

### MySQL Connection
```properties
URL: jdbc:mysql://localhost:3306/medora
Username: root
Password: [Your Password]
Driver: com.mysql.cj.jdbc.Driver
Dialect: org.hibernate.dialect.MySQLDialect
```

### JPA Settings
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

---

## 🧪 Testing

### Backend Tests
```bash
cd projectbackend
mvnw test
```

### Frontend Tests
```bash
cd project
npm run test
```

### API Testing
```bash
# Use test-auth.bat or Postman
# Test authentication endpoints first
# Then test protected endpoints with token
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows - Kill process
netstat -ano | findstr :8080
taskkill /F /PID <PID>
```

### Database Connection Failed
```bash
# Check MySQL service
net start MySQL80

# Verify credentials in application.properties
# Create database if it doesn't exist
CREATE DATABASE medora;
```

### CORS Errors
- Verify CorsConfig.java allows http://localhost:5173
- Check frontend API base URL in .env

### Socket Connection Issues
- Ensure call server is running on port 5002
- Check firewall settings
- Verify SOCKET_URL in frontend env

---

## 📁 Project Structure Reference

```
2.0/
├── project/                    # React Frontend
│   ├── src/
│   │   ├── components/        # UI Components
│   │   ├── pages/             # Route Pages
│   │   ├── services/          # API & Socket
│   │   ├── contexts/          # React Context
│   │   └── types/             # TypeScript Types
│   └── package.json
│
├── projectbackend/            # Spring Boot Backend
│   ├── src/main/java/.../projectbackend/
│   │   ├── controller/        # REST Controllers
│   │   ├── service/           # Business Logic
│   │   ├── model/             # JPA Entities
│   │   ├── repository/        # Data Access
│   │   └── config/            # Configuration
│   └── pom.xml
│
├── call-server/               # Socket.IO Call Server
│   ├── server.js
│   └── package.json
│
├── START_ALL.bat              # Start all services
└── setup-database.sql         # Database setup
```

---

## 🔑 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:5002
```

### Backend (application.properties)
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/medora
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

---

## 📈 Performance Metrics

### Expected Performance
- **API Response Time**: < 200ms
- **Page Load Time**: < 2 seconds
- **Video Call Latency**: < 100ms
- **Database Query Time**: < 50ms

### Scalability
- **Concurrent Users**: 1000+ (with load balancer)
- **Concurrent Video Calls**: 100+ (with WebRTC P2P)
- **Database Connections**: Pool of 10-20

---

## 🌐 Frontend Routes

### Public Routes
```
/                   - Landing page
/login              - Login page
/signup             - Registration
/privacy            - Privacy policy
/terms              - Terms of service
/contact            - Contact page
```

### Patient Routes
```
/patient/appointments       - Appointments
/patient/prescriptions      - Prescriptions
/patient/doctors            - Browse doctors
/patient/pharmacy           - Pharmacy locator
/patient/medicines          - Medicine search
/patient/health-records     - Medical records
/patient/symptom-checker    - Symptom analysis
```

### Doctor Routes
```
/doctor/appointments            - Appointments
/doctor/consultation-requests   - Instant consultations
/doctor/patients                - Patient list
/doctor/prescriptions           - Prescriptions
/doctor/consultations           - Consultation history
/doctor/schedule                - Availability
```

### Pharmacy Routes
```
/pharmacy/inventory         - Stock management
/pharmacy/orders            - Order processing
/pharmacy/prescriptions     - Prescription fulfillment
/pharmacy/sales             - Sales dashboard
/pharmacy/settings          - Settings
```

### Admin Routes
```
/admin/users            - User management
/admin/analytics        - Analytics
/admin/reports          - Reports
/admin/settings         - Settings
```

---

## 💡 Best Practices

### Code Standards
- ✅ Use TypeScript for type safety
- ✅ Follow REST API conventions
- ✅ Implement proper error handling
- ✅ Use environment variables for config
- ✅ Write modular, reusable components
- ✅ Implement proper logging

### Security
- ✅ Never commit passwords or API keys
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Validate all user inputs
- ✅ Use parameterized queries
- ✅ Implement CSRF protection

### Performance
- ✅ Implement caching where appropriate
- ✅ Optimize database queries
- ✅ Use lazy loading for routes
- ✅ Minimize bundle size
- ✅ Use CDN for static assets
- ✅ Implement pagination for lists

---

## 📞 Support & Resources

### Documentation Files
- `README.md` - Main project documentation
- `COMPLETE_ARCHITECTURE.md` - Full architecture details
- `FIREBASE_IMPLEMENTATION_GUIDE.md` - Firebase migration guide
- `ARCHITECTURE_DIAGRAMS.md` - Visual diagrams
- `PROJECT_STRUCTURE.md` - Detailed file structure
- `QUICK_START.md` - Quick setup guide
- `DATABASE_FIX_GUIDE.md` - Database troubleshooting

### External Resources
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **React Docs**: https://react.dev
- **Firebase Docs**: https://firebase.google.com/docs
- **Socket.IO Docs**: https://socket.io/docs
- **WebRTC Guide**: https://webrtc.org/getting-started

---

## ✅ Pre-deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Security configurations reviewed
- [ ] CORS properly configured
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Performance tested
- [ ] Browser compatibility tested
- [ ] Mobile responsiveness verified
- [ ] SSL certificate installed
- [ ] Backup strategy in place
- [ ] Monitoring tools setup
- [ ] Documentation updated

---

## 📊 System Metrics Dashboard

### Monitor These Metrics
- Active users (by role)
- API requests per minute
- Database connection pool usage
- WebSocket connections count
- Video call duration average
- Error rate percentage
- Response time p95/p99
- Database query performance

### Alerts to Setup
- High error rate (> 5%)
- Slow API responses (> 1s)
- Database connection pool exhausted
- Disk space low (< 10%)
- High CPU usage (> 80%)
- Memory usage high (> 90%)

---

## 🎯 Quick Commands Cheat Sheet

```bash
# Start MySQL
net start MySQL80

# Backend
cd projectbackend
mvnw clean install        # Build
mvnw spring-boot:run     # Run
mvnw test                # Test

# Frontend
cd project
npm install              # Install dependencies
npm run dev             # Development server
npm run build           # Production build
npm run preview         # Preview production build
npm test                # Run tests

# Call Server
cd call-server
npm install             # Install dependencies
npm start               # Start server

# Database
mysql -u root -p        # Connect to MySQL
SHOW DATABASES;         # List databases
USE medora;             # Select database
SHOW TABLES;            # List tables
DESCRIBE users;         # Table structure

# Git
git add .               # Stage changes
git commit -m "message" # Commit
git push                # Push to remote
git pull                # Pull from remote
git status              # Check status

# Firebase
firebase login          # Login to Firebase
firebase init           # Initialize project
firebase deploy         # Deploy all
firebase deploy --only hosting  # Deploy hosting only
firebase deploy --only functions # Deploy functions only
```

---

## 🌟 Key Features Summary

✅ **4 User Roles** with distinct dashboards  
✅ **Real-time Video Calls** with WebRTC  
✅ **Appointment Management** with status tracking  
✅ **Prescription System** with digital records  
✅ **Medicine Search** with inventory management  
✅ **Pharmacy Locator** with maps integration  
✅ **Doctor Availability** real-time status  
✅ **Health Records** secure storage  
✅ **Symptom Checker** AI-powered analysis  
✅ **Responsive Design** mobile-friendly  

---

**Document Version**: 1.0  
**Purpose**: Quick reference for developers  
**Last Updated**: March 1, 2026  
**Project**: MeDora TeleMedicine Platform
