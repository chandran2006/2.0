# 📁 MeDora - Complete Project Structure

## 🌳 Directory Tree

```
2.0/
│
├── 📄 START_ALL.bat                    ⭐ Run this to start everything
├── 📄 test-auth.bat                    🧪 Test authentication
├── 📄 QUICK_START.md                   📖 Quick reference
├── 📄 DATABASE_FIX_GUIDE.md            📖 Detailed guide
├── 📄 VERIFICATION_CHECKLIST.md        ✅ Testing checklist
├── 📄 CHANGES_SUMMARY.md               📊 What was changed
├── 📄 PROJECT_STRUCTURE.md             📁 This file
├── 📄 README.md                        📖 Main documentation
│
├── 📂 projectbackend/                  ☕ Java Spring Boot Backend
│   ├── src/main/
│   │   ├── java/com/example/projectbackend/
│   │   │   ├── 📂 config/
│   │   │   │   ├── CorsConfig.java
│   │   │   │   ├── DataInitializer.java        ✏️ MODIFIED
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── WebSocketConfig.java
│   │   │   │
│   │   │   ├── 📂 controller/
│   │   │   │   ├── AuthController.java         ✏️ MODIFIED
│   │   │   │   ├── AppointmentController.java
│   │   │   │   ├── CallController.java
│   │   │   │   ├── MedicineController.java
│   │   │   │   ├── PharmacyController.java
│   │   │   │   ├── PrescriptionController.java
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── 📂 model/
│   │   │   │   ├── User.java
│   │   │   │   ├── Appointment.java
│   │   │   │   ├── Prescription.java
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── 📂 repository/
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── AppointmentRepository.java
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── 📂 service/
│   │   │   │   ├── UserService.java            ✏️ MODIFIED
│   │   │   │   ├── AppointmentService.java
│   │   │   │   └── ...
│   │   │   │
│   │   │   └── ProjectbackendApplication.java
│   │   │
│   │   └── resources/
│   │       └── application.properties          ✏️ MODIFIED
│   │
│   ├── pom.xml
│   └── mvnw.cmd
│
├── 📂 project/                         ⚛️ React Frontend
│   ├── src/
│   │   ├── 📂 components/
│   │   │   ├── dashboards/
│   │   │   │   ├── PatientDashboard.tsx
│   │   │   │   ├── DoctorDashboard.tsx
│   │   │   │   ├── PharmacyDashboard.tsx
│   │   │   │   └── AdminDashboard.tsx
│   │   │   │
│   │   │   ├── shared/
│   │   │   │   └── DashboardLayout.tsx
│   │   │   │
│   │   │   └── ui/                     (50+ UI components)
│   │   │
│   │   ├── 📂 contexts/
│   │   │   └── AuthContext.tsx                 ✏️ MODIFIED
│   │   │
│   │   ├── 📂 pages/
│   │   │   ├── Index.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignUpPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── NotFound.tsx
│   │   │   │
│   │   │   ├── 📂 patient/             ⭐ NEW FOLDER
│   │   │   │   ├── AppointmentsPage.tsx        ✨ NEW
│   │   │   │   ├── PrescriptionsPage.tsx       ✨ NEW
│   │   │   │   ├── DoctorsPage.tsx             ✨ NEW
│   │   │   │   └── PharmacyPage.tsx            ✨ NEW
│   │   │   │
│   │   │   ├── 📂 doctor/              ⭐ NEW FOLDER
│   │   │   │   ├── PatientsPage.tsx            ✨ NEW
│   │   │   │   └── PrescriptionsManagePage.tsx ✨ NEW
│   │   │   │
│   │   │   ├── 📂 pharmacy/            ⭐ NEW FOLDER
│   │   │   │   ├── InventoryPage.tsx           ✨ NEW
│   │   │   │   └── OrdersPage.tsx              ✨ NEW
│   │   │   │
│   │   │   └── 📂 admin/               ⭐ NEW FOLDER
│   │   │       ├── UsersManagePage.tsx         ✨ NEW
│   │   │       └── AnalyticsPage.tsx           ✨ NEW
│   │   │
│   │   ├── 📂 services/
│   │   │   ├── api.ts
│   │   │   └── socket.ts
│   │   │
│   │   ├── 📂 types/
│   │   │   └── index.ts
│   │   │
│   │   ├── App.tsx                             ✏️ MODIFIED
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── 📂 call-server/                     🎥 WebRTC Call Server
    ├── server.js
    ├── package.json
    └── node_modules/
```

---

## 🎯 Key Files Explained

### Backend (Java Spring Boot)

#### ✏️ Modified Files

**1. application.properties**
```properties
# Database persistence configuration
spring.jpa.hibernate.ddl-auto=update  # Changed from create-drop
```
- Controls database behavior
- Now persists data between restarts

**2. DataInitializer.java**
```java
// Prevents duplicate data
if (userRepository.count() > 0) {
    return; // Skip initialization
}
```
- Creates demo users on first run
- Skips if data already exists
- Logs initialization progress

**3. AuthController.java**
```java
@GetMapping("/test-db")
public ResponseEntity<?> testDatabase() {
    // Test endpoint for debugging
}
```
- Handles login/register requests
- Added test endpoint
- Enhanced logging

**4. UserService.java**
```java
public long getUserCount() {
    return userRepository.count();
}
```
- User management logic
- Added count method for testing

---

### Frontend (React + TypeScript)

#### ✏️ Modified Files

**1. AuthContext.tsx**
```typescript
console.log('Login attempt for:', email);
console.log('Login response:', response.data);
```
- Manages authentication state
- Added detailed logging
- Better error handling

**2. App.tsx**
```typescript
// Added 10 new routes
<Route path="/patient/appointments" element={<AppointmentsPage />} />
<Route path="/doctor/patients" element={<PatientsPage />} />
// ... etc
```
- Main routing configuration
- Added all new page routes

#### ✨ New Pages Created

**Patient Pages (4)**
1. **AppointmentsPage.tsx** - View and manage appointments
2. **PrescriptionsPage.tsx** - View prescriptions and download
3. **DoctorsPage.tsx** - Browse and book doctors
4. **PharmacyPage.tsx** - Find nearby pharmacies

**Doctor Pages (2)**
1. **PatientsPage.tsx** - Manage patient list
2. **PrescriptionsManagePage.tsx** - Create and manage prescriptions

**Pharmacy Pages (2)**
1. **InventoryPage.tsx** - Manage medicine inventory
2. **OrdersPage.tsx** - Process prescription orders

**Admin Pages (2)**
1. **UsersManagePage.tsx** - Manage all users
2. **AnalyticsPage.tsx** - View system analytics

---

## 🗺️ Page Navigation Map

```
Landing Page (/)
    │
    ├─→ Login (/login)
    │       │
    │       └─→ Dashboard (/dashboard)
    │               │
    │               ├─→ PATIENT PAGES
    │               │   ├─→ /patient/appointments
    │               │   ├─→ /patient/prescriptions
    │               │   ├─→ /patient/doctors
    │               │   └─→ /patient/pharmacy
    │               │
    │               ├─→ DOCTOR PAGES
    │               │   ├─→ /doctor/patients
    │               │   └─→ /doctor/prescriptions
    │               │
    │               ├─→ PHARMACY PAGES
    │               │   ├─→ /pharmacy/inventory
    │               │   └─→ /pharmacy/orders
    │               │
    │               └─→ ADMIN PAGES
    │                   ├─→ /admin/users
    │                   └─→ /admin/analytics
    │
    └─→ Sign Up (/signup)
            │
            └─→ Dashboard (/dashboard)
```

---

## 🔌 API Endpoints Map

```
Backend API (http://localhost:8080/api)
│
├─→ /auth
│   ├─→ POST /login              (Login user)
│   ├─→ POST /register           (Register user)
│   ├─→ GET /current-user/{id}   (Get user details)
│   └─→ GET /test-db             (Test database) ⭐ NEW
│
├─→ /appointments
│   ├─→ GET /doctors             (Get all doctors)
│   ├─→ POST /book               (Book appointment)
│   ├─→ GET /patient/{id}        (Get patient appointments)
│   ├─→ GET /doctor/{id}         (Get doctor appointments)
│   ├─→ PUT /{id}/approve        (Approve appointment)
│   └─→ PUT /{id}/cancel         (Cancel appointment)
│
├─→ /prescriptions
│   ├─→ POST /create             (Create prescription)
│   ├─→ GET /patient/{id}        (Get patient prescriptions)
│   ├─→ GET /doctor/{id}         (Get doctor prescriptions)
│   └─→ PUT /{id}/status         (Update status)
│
├─→ /medicines
│   ├─→ GET /                    (Get all medicines)
│   ├─→ GET /search?q={query}    (Search medicines)
│   ├─→ POST /create             (Add medicine)
│   └─→ PUT /{id}                (Update medicine)
│
├─→ /pharmacies
│   ├─→ GET /                    (Get all pharmacies)
│   └─→ GET /nearby?lat=&lng=    (Get nearby pharmacies)
│
└─→ /calls
    ├─→ POST /initiate           (Start call)
    ├─→ POST /doctor/online      (Doctor goes online)
    ├─→ POST /doctor/offline     (Doctor goes offline)
    └─→ GET /doctors/available   (Get available doctors)
```

---

## 🎨 Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── Routes
│       ├── Index (Landing Page)
│       ├── LoginPage
│       ├── SignUpPage
│       ├── DashboardPage
│       │   └── Role-based Dashboard
│       │       ├── PatientDashboard
│       │       ├── DoctorDashboard
│       │       ├── PharmacyDashboard
│       │       └── AdminDashboard
│       │
│       ├── Patient Pages ⭐
│       │   ├── AppointmentsPage
│       │   ├── PrescriptionsPage
│       │   ├── DoctorsPage
│       │   └── PharmacyPage
│       │
│       ├── Doctor Pages ⭐
│       │   ├── PatientsPage
│       │   └── PrescriptionsManagePage
│       │
│       ├── Pharmacy Pages ⭐
│       │   ├── InventoryPage
│       │   └── OrdersPage
│       │
│       ├── Admin Pages ⭐
│       │   ├── UsersManagePage
│       │   └── AnalyticsPage
│       │
│       └── NotFound
```

---

## 📊 File Statistics

### Backend
- **Total Files:** ~30
- **Modified:** 4
- **New:** 0
- **Lines Changed:** ~100

### Frontend
- **Total Files:** ~80
- **Modified:** 2
- **New:** 10
- **Lines Added:** ~1,500

### Documentation
- **New Files:** 7
- **Lines:** ~1,000

---

## 🚀 Startup Sequence

```
1. START_ALL.bat
   │
   ├─→ Terminal 1: Backend
   │   └─→ mvnw.cmd spring-boot:run
   │       └─→ Port 8080
   │           └─→ Initialize Database
   │               └─→ Create Demo Users
   │
   ├─→ Terminal 2: Frontend
   │   └─→ npm run dev
   │       └─→ Port 5173
   │           └─→ Vite Dev Server
   │
   └─→ Terminal 3: Call Server
       └─→ npm start
           └─→ Port 5002
               └─→ WebRTC Server
```

---

## 🎯 Quick Access URLs

### Main Application
- 🏠 Frontend: http://localhost:5173
- 🔧 Backend API: http://localhost:8080/api
- 📞 Call Server: http://localhost:5002

### Testing & Debug
- 🧪 Test DB: http://localhost:8080/api/auth/test-db
- 💾 H2 Console: http://localhost:8080/h2-console

### New Pages
- 📅 Appointments: http://localhost:5173/patient/appointments
- 💊 Prescriptions: http://localhost:5173/patient/prescriptions
- 👨‍⚕️ Doctors: http://localhost:5173/patient/doctors
- 🏥 Pharmacy: http://localhost:5173/patient/pharmacy
- 👥 Patients: http://localhost:5173/doctor/patients
- 📦 Inventory: http://localhost:5173/pharmacy/inventory
- 📋 Orders: http://localhost:5173/pharmacy/orders
- 👤 Users: http://localhost:5173/admin/users
- 📊 Analytics: http://localhost:5173/admin/analytics

---

## ✅ What's Working

✅ Database persistence
✅ User authentication
✅ Role-based dashboards
✅ 10 new feature pages
✅ API integration
✅ Routing system
✅ Error logging
✅ Test endpoints

---

**📖 For more details, see:**
- QUICK_START.md - Quick reference
- DATABASE_FIX_GUIDE.md - Detailed guide
- VERIFICATION_CHECKLIST.md - Testing steps
- CHANGES_SUMMARY.md - What changed
