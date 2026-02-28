# MeDora Project Structure

```
2.0/
│
├── 📄 README.md                          # Main project documentation
├── 📄 SETUP_GUIDE.md                     # Detailed setup instructions
├── 📄 PROJECT_SUMMARY.md                 # Project completion summary
├── 📄 QUICK_REFERENCE.md                 # Quick reference card
├── 📄 .gitignore                         # Git ignore rules
├── 🚀 START_ALL.bat                      # Windows startup script
├── ✅ CHECK_PREREQUISITES.bat            # Prerequisites checker
│
├── 📁 projectbackend/                    # BACKEND (Spring Boot)
│   │
│   ├── 📄 pom.xml                        # Maven dependencies
│   ├── 📄 mvnw.cmd                       # Maven wrapper (Windows)
│   │
│   └── 📁 src/
│       │
│       ├── 📁 main/
│       │   │
│       │   ├── 📁 java/com/example/projectbackend/
│       │   │   │
│       │   │   ├── 📄 ProjectbackendApplication.java    # Main entry point
│       │   │   │
│       │   │   ├── 📁 controller/                       # REST API Controllers (10)
│       │   │   │   ├── 📄 AuthController.java           # Login/Register
│       │   │   │   ├── 📄 AppointmentController.java    # Appointments
│       │   │   │   ├── 📄 CallController.java           # Video/Audio calls
│       │   │   │   ├── 📄 PrescriptionController.java   # Prescriptions
│       │   │   │   ├── 📄 MedicineController.java       # Medicines
│       │   │   │   ├── 📄 PharmacyController.java       # Pharmacies
│       │   │   │   ├── 📄 SymptomController.java        # Symptom checker
│       │   │   │   ├── 📄 HealthRecordController.java   # Health records
│       │   │   │   ├── 📄 WebRTCController.java         # WebRTC signaling
│       │   │   │   ├── 📄 ReportController.java         # Analytics
│       │   │   │   └── 📄 TestController.java           # Testing
│       │   │   │
│       │   │   ├── 📁 service/                          # Business Logic (8)
│       │   │   │   ├── 📄 UserService.java
│       │   │   │   ├── 📄 AppointmentService.java
│       │   │   │   ├── 📄 CallService.java
│       │   │   │   ├── 📄 PrescriptionService.java
│       │   │   │   ├── 📄 MedicineService.java
│       │   │   │   └── 📄 PharmacyService.java
│       │   │   │
│       │   │   ├── 📁 model/                            # Database Entities (9)
│       │   │   │   ├── 📄 User.java
│       │   │   │   ├── 📄 Appointment.java
│       │   │   │   ├── 📄 Call.java
│       │   │   │   ├── 📄 Prescription.java
│       │   │   │   ├── 📄 Medicine.java
│       │   │   │   ├── 📄 Pharmacy.java
│       │   │   │   ├── 📄 HealthRecord.java
│       │   │   │   ├── 📄 DoctorAvailability.java
│       │   │   │   └── 📄 Report.java
│       │   │   │
│       │   │   ├── 📁 repository/                       # JPA Repositories (9)
│       │   │   │   ├── 📄 UserRepository.java
│       │   │   │   ├── 📄 AppointmentRepository.java
│       │   │   │   ├── 📄 CallRepository.java
│       │   │   │   ├── 📄 PrescriptionRepository.java
│       │   │   │   ├── 📄 MedicineRepository.java
│       │   │   │   ├── 📄 PharmacyRepository.java
│       │   │   │   ├── 📄 HealthRecordRepository.java
│       │   │   │   ├── 📄 DoctorAvailabilityRepository.java
│       │   │   │   └── 📄 ReportRepository.java
│       │   │   │
│       │   │   └── 📁 config/                           # Configuration (4)
│       │   │       ├── 📄 SecurityConfig.java           # Spring Security
│       │   │       ├── 📄 CorsConfig.java               # CORS settings
│       │   │       ├── 📄 WebSocketConfig.java          # WebSocket
│       │   │       └── 📄 DataInitializer.java          # Sample data
│       │   │
│       │   └── 📁 resources/
│       │       └── 📄 application.properties             # App configuration
│       │
│       └── 📁 test/                                     # Test files
│
│
├── 📁 project/                           # FRONTEND (React + TypeScript)
│   │
│   ├── 📄 package.json                   # NPM dependencies
│   ├── 📄 vite.config.ts                 # Vite configuration
│   ├── 📄 tsconfig.json                  # TypeScript config
│   ├── 📄 tsconfig.node.json             # TypeScript node config
│   ├── 📄 tailwind.config.js             # TailwindCSS config
│   ├── 📄 postcss.config.js              # PostCSS config
│   ├── 📄 index.html                     # HTML entry point
│   │
│   ├── 📁 public/                        # Static assets
│   │
│   └── 📁 src/
│       │
│       ├── 📄 main.tsx                   # React entry point
│       ├── 📄 App.tsx                    # Main App component
│       ├── 📄 index.css                  # Global styles
│       │
│       ├── 📁 pages/                     # Page Components
│       │   └── 📄 Index.tsx              # Landing page
│       │
│       ├── 📁 components/
│       │   │
│       │   ├── 📁 dashboards/            # Role-based Dashboards (4)
│       │   │   ├── 📄 PatientDashboard.tsx
│       │   │   ├── 📄 DoctorDashboard.tsx
│       │   │   ├── 📄 PharmacyDashboard.tsx
│       │   │   └── 📄 AdminDashboard.tsx
│       │   │
│       │   └── 📁 shared/                # Shared Components
│       │       ├── 📄 LoginPage.tsx
│       │       └── 📄 SignUpPage.tsx
│       │
│       ├── 📁 contexts/                  # Global State
│       │   └── 📄 AuthContext.tsx        # Authentication context
│       │
│       ├── 📁 services/                  # API Services (6)
│       │   ├── 📄 api.ts                 # Axios configuration
│       │   ├── 📄 authService.ts         # Auth API calls
│       │   ├── 📄 appointmentService.ts  # Appointment API
│       │   ├── 📄 prescriptionService.ts # Prescription API
│       │   ├── 📄 medicineService.ts     # Medicine API
│       │   └── 📄 callService.ts         # Call API
│       │
│       ├── 📁 types/                     # TypeScript Types
│       │   └── 📄 index.ts               # Type definitions
│       │
│       └── 📁 lib/                       # Utilities
│
│
└── 📁 call-server/                       # CALL SERVER (Node.js + Socket.IO)
    │
    ├── 📄 package.json                   # NPM dependencies
    └── 📄 server.js                      # WebSocket server


═══════════════════════════════════════════════════════════════════

📊 STATISTICS:

Backend:
  - Controllers: 10
  - Services: 8
  - Models: 9
  - Repositories: 9
  - Config Files: 4
  - Total Backend Files: 40+

Frontend:
  - Dashboards: 4
  - Pages: 1
  - Shared Components: 2
  - Services: 6
  - Contexts: 1
  - Total Frontend Files: 20+

Call Server:
  - Server Files: 1

Documentation:
  - README files: 4
  - Scripts: 2

TOTAL FILES CREATED: 60+

═══════════════════════════════════════════════════════════════════

🎯 KEY FEATURES:

✅ User Authentication & Authorization
✅ Role-Based Access Control (4 roles)
✅ Appointment Management System
✅ Prescription Management System
✅ Medicine Inventory Management
✅ Real-time Communication (WebSocket)
✅ Doctor Availability Status
✅ Health Metrics Dashboard
✅ Responsive UI (TailwindCSS)
✅ RESTful API (40+ endpoints)
✅ Type-Safe Frontend (TypeScript)
✅ Database with Sample Data

═══════════════════════════════════════════════════════════════════

🚀 PORTS:

Backend:     http://localhost:8080
Frontend:    http://localhost:5173
Call Server: http://localhost:5002
H2 Console:  http://localhost:8080/h2-console

═══════════════════════════════════════════════════════════════════
```
