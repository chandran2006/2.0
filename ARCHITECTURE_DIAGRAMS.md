# 🎨 MeDora System Architecture - Visual Diagrams

## 📐 Architecture Overview

### Current System Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT/BROWSER                                │
│                                                                             │
│  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
│  ┃           React SPA (Single Page Application)                     ┃  │
│  ┃                                                                     ┃  │
│  ┃  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐             ┃  │
│  ┃  │   Patient   │  │   Doctor    │  │   Pharmacy   │             ┃  │
│  ┃  │  Dashboard  │  │  Dashboard  │  │   Dashboard  │             ┃  │
│  ┃  └─────────────┘  └─────────────┘  └──────────────┘             ┃  │
│  ┃                                                                     ┃  │
│  ┃  Port: 5173 (Vite Dev Server)                                     ┃  │
│  ┃  Technology: React 18, TypeScript, TailwindCSS                    ┃  │
│  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛  │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │                │
                    ▼               ▼                ▼
        ┌──────────────────┐  ┌─────────────┐  ┌──────────────────┐
        │   REST APIs      │  │  WebSocket  │  │  Call Server     │
        │   (Port 8080)    │  │ (Port 8080) │  │  (Port 5002)     │
        │                  │  │             │  │                  │
        │  Spring Boot     │  │  STOMP      │  │  Socket.IO       │
        │                  │  │  Protocol   │  │                  │
        │  ┌────────────┐  │  │             │  │  ┌─────────────┐ │
        │  │Controllers │  │  │             │  │  │   Events    │ │
        │  │  Services  │  │  │             │  │  │   Rooms     │ │
        │  │Repositories│  │  │             │  │  │   Signaling │ │
        │  └────────────┘  │  │             │  │  └─────────────┘ │
        └──────────────────┘  └─────────────┘  └──────────────────┘
                 │                                       │
                 │                                       │
                 ▼                                       ▼
        ┌──────────────────┐                  ┌──────────────────┐
        │  MySQL Database  │                  │   WebRTC P2P     │
        │   (Port 3306)    │                  │  Video/Audio     │
        │                  │                  │   Connection     │
        │  ┌────────────┐  │                  └──────────────────┘
        │  │   Tables   │  │
        │  │  - users   │  │
        │  │  - appts   │  │
        │  │  - presc   │  │
        │  └────────────┘  │
        └──────────────────┘
```

---

## 🌊 Data Flow Diagrams

### 1. User Authentication Flow

```
┌─────────┐                    ┌─────────┐                    ┌──────────┐
│ User    │                    │ React   │                    │ Spring   │
│ Browser │                    │ Frontend│                    │ Backend  │
└────┬────┘                    └────┬────┘                    └────┬─────┘
     │                              │                              │
     │ 1. Enter email/password      │                              │
     ├─────────────────────────────>│                              │
     │                              │                              │
     │                              │ 2. POST /api/auth/login      │
     │                              ├─────────────────────────────>│
     │                              │                              │
     │                              │                              │ 3. Query DB
     │                              │                              ├──────┐
     │                              │                              │      │
     │                              │                              │<─────┘
     │                              │                              │
     │                              │   4. User data + token       │
     │                              │<─────────────────────────────┤
     │                              │                              │
     │  5. Store in localStorage    │                              │
     │  & Context                   │                              │
     │                              │                              │
     │ 6. Redirect to dashboard     │                              │
     │<─────────────────────────────┤                              │
     │                              │                              │
```

---

### 2. Book Appointment Flow

```
┌─────────┐         ┌─────────┐         ┌─────────┐         ┌──────────┐
│ Patient │         │ Frontend│         │ Backend │         │  MySQL   │
└────┬────┘         └────┬────┘         └────┬────┘         └────┬─────┘
     │                   │                   │                   │
     │ 1. Select doctor  │                   │                   │
     │ & fill form       │                   │                   │
     ├──────────────────>│                   │                   │
     │                   │                   │                   │
     │                   │ 2. POST /api/     │                   │
     │                   │ appointments/book │                   │
     │                   ├──────────────────>│                   │
     │                   │                   │                   │
     │                   │                   │ 3. INSERT INTO    │
     │                   │                   │ appointments      │
     │                   │                   ├──────────────────>│
     │                   │                   │                   │
     │                   │                   │ 4. Appointment ID │
     │                   │                   │<──────────────────┤
     │                   │                   │                   │
     │                   │ 5. Success        │ 6. WebSocket      │
     │                   │ response          │ notification to   │
     │                   │<──────────────────┤ doctor            │
     │                   │                   │                   │
     │ 7. Show success   │                   │                   │
     │<──────────────────┤                   │                   │
     │                   │                   │                   │
```

---

### 3. Video Call Consultation Flow

```
┌─────────┐    ┌─────────┐    ┌──────────┐    ┌─────────┐    ┌─────────┐
│ Patient │    │ Frontend│    │  Call    │    │ Frontend│    │ Doctor  │
│         │    │         │    │  Server  │    │         │    │         │
└────┬────┘    └────┬────┘    └────┬─────┘    └────┬────┘    └────┬────┘
     │              │              │              │              │
     │ 1. Request   │              │              │              │
     │ consultation │              │              │              │
     ├─────────────>│              │              │              │
     │              │              │              │              │
     │              │ 2. emit      │              │              │
     │              │ 'consultation│              │              │
     │              │ _request'    │              │              │
     │              ├─────────────>│              │              │
     │              │              │              │              │
     │              │              │ 3. Forward   │              │
     │              │              │ to doctor    │              │
     │              │              ├─────────────>│              │
     │              │              │              │              │
     │              │              │              │ 4. Accept    │
     │              │              │              │<─────────────┤
     │              │              │              │              │
     │              │              │ 5. Notify    │              │
     │              │              │ patient      │              │
     │              │<─────────────┤              │              │
     │              │              │              │              │
     │              │ 6. Both join room           │              │
     │              ├──────────────┼──────────────┤              │
     │              │              │              │              │
     │              │ 7. Exchange  │              │              │
     │              │ WebRTC       │              │              │
     │              │ offer/answer │              │              │
     │              │<─────────────┼─────────────>│              │
     │              │              │              │              │
     │              │ 8. P2P Connection Established              │
     │              │<══════════════════════════════════════════>│
     │              │                                            │
     │ 9. Video/Audio streaming                                 │
     │<══════════════════════════════════════════════════════════>
     │                                                           │
```

---

### 4. Doctor Online Status (Real-time)

```
┌─────────┐         ┌─────────┐         ┌──────────┐         ┌─────────┐
│ Doctor  │         │ Frontend│         │  Call    │         │ Patient │
│ Browser │         │         │         │  Server  │         │ Browser │
└────┬────┘         └────┬────┘         └────┬─────┘         └────┬────┘
     │                   │                   │                   │
     │ 1. Login &        │                   │                   │
     │ Toggle "Online"   │                   │                   │
     ├──────────────────>│                   │                   │
     │                   │                   │                   │
     │                   │ 2. emit           │                   │
     │                   │ 'doctor_online'   │                   │
     │                   ├──────────────────>│                   │
     │                   │                   │                   │
     │                   │                   │ 3. Store in       │
     │                   │                   │ onlineDoctors Map │
     │                   │                   │                   │
     │                   │                   │ 4. Broadcast      │
     │                   │                   │ 'doctor_status'   │
     │                   │                   ├──────────────────>│
     │                   │                   │                   │
     │                   │                   │ 5. Update UI      │
     │                   │                   │ (green indicator) │
     │                   │                   │                   │
     │ 6. Closes browser │                   │                   │
     │ (disconnect)      │                   │                   │
     │                   │                   │                   │
     │                   │ 7. Socket         │                   │
     │                   │ disconnected      │                   │
     │                   │──────────────────>│                   │
     │                   │                   │                   │
     │                   │                   │ 8. Remove from    │
     │                   │                   │ onlineDoctors     │
     │                   │                   │                   │
     │                   │                   │ 9. Broadcast      │
     │                   │                   │ 'doctor_offline'  │
     │                   │                   ├──────────────────>│
     │                   │                   │                   │
```

---

## 🗄️ Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USERS TABLE                                 │
├──────────────┬─────────────────┬────────────────────────────────────┤
│ id (PK)      │ BIGINT          │ Primary Key                        │
│ email        │ VARCHAR(255)    │ UNIQUE, NOT NULL                   │
│ password     │ VARCHAR(255)    │ BCrypt hashed                      │
│ name         │ VARCHAR(255)    │                                    │
│ role         │ ENUM            │ PATIENT|DOCTOR|PHARMACY|ADMIN      │
│ phone        │ VARCHAR(20)     │                                    │
│ address      │ VARCHAR(500)    │                                    │
│ specialization│VARCHAR(255)    │ For DOCTOR only                    │
│ license_number│VARCHAR(100)    │ For DOCTOR only                    │
│ pharmacy_name│ VARCHAR(255)    │ For PHARMACY only                  │
│ is_available │ BOOLEAN         │ Online status (for DOCTOR)         │
│ created_at   │ TIMESTAMP       │                                    │
│ updated_at   │ TIMESTAMP       │                                    │
└──────────────┴─────────────────┴────────────────────────────────────┘
                         │
                         │ 1:N relationship
                         │
        ┌────────────────┼────────────────┐
        │                                  │
        ▼                                  ▼
┌────────────────────────────┐    ┌────────────────────────────┐
│   APPOINTMENTS TABLE       │    │   PRESCRIPTIONS TABLE      │
├────────────┬──────────────┤    ├────────────┬──────────────┤
│ id (PK)    │ BIGINT       │    │ id (PK)    │ BIGINT       │
│ patient_id │ BIGINT (FK)  │    │ patient_id │ BIGINT (FK)  │
│ doctor_id  │ BIGINT (FK)  │    │ doctor_id  │ BIGINT (FK)  │
│ date       │ TIMESTAMP    │    │ medicine_id│ BIGINT (FK)  │
│ status     │ ENUM         │    │ med_name   │ VARCHAR      │
│ symptoms   │ TEXT         │    │ dosage     │ VARCHAR      │
│ notes      │ TEXT         │    │ duration   │ VARCHAR      │
│ type       │ VARCHAR      │    │ instructions│TEXT         │
│ created_at │ TIMESTAMP    │    │ status     │ ENUM         │
└────────────┴──────────────┘    │ created_at │ TIMESTAMP    │
                                  └────────────┴──────────────┘
                                           │
                                           │ N:1 relationship
                                           │
                                           ▼
                                  ┌────────────────────────────┐
                                  │   MEDICINES TABLE          │
                                  ├────────────┬──────────────┤
                                  │ id (PK)    │ BIGINT       │
                                  │ name       │ VARCHAR      │
                                  │ category   │ VARCHAR      │
                                  │ manufacturer│VARCHAR      │
                                  │ description│ TEXT         │
                                  │ price      │ DECIMAL      │
                                  │ stock      │ INT          │
                                  │ requires_rx│ BOOLEAN      │
                                  └────────────┴──────────────┘

┌────────────────────────────┐    ┌────────────────────────────┐
│   PHARMACIES TABLE         │    │   CALLS TABLE              │
├────────────┬──────────────┤    ├────────────┬──────────────┤
│ id (PK)    │ BIGINT       │    │ id (PK)    │ BIGINT       │
│ name       │ VARCHAR      │    │ patient_id │ BIGINT (FK)  │
│ address    │ VARCHAR      │    │ doctor_id  │ BIGINT (FK)  │
│ phone      │ VARCHAR      │    │ start_time │ TIMESTAMP    │
│ email      │ VARCHAR      │    │ end_time   │ TIMESTAMP    │
│ latitude   │ DECIMAL      │    │ duration   │ INT          │
│ longitude  │ DECIMAL      │    │ status     │ VARCHAR      │
│ rating     │ DECIMAL      │    │ call_type  │ VARCHAR      │
│ is_open    │ BOOLEAN      │    │ room_id    │ VARCHAR      │
└────────────┴──────────────┘    └────────────┴──────────────┘

┌────────────────────────────┐    ┌────────────────────────────┐
│   HEALTH_RECORDS TABLE     │    │   REPORTS TABLE            │
├────────────┬──────────────┤    ├────────────┬──────────────┤
│ id (PK)    │ BIGINT       │    │ id (PK)    │ BIGINT       │
│ patient_id │ BIGINT (FK)  │    │ report_type│ VARCHAR      │
│ record_type│ VARCHAR      │    │ generated_by│BIGINT (FK)  │
│ title      │ VARCHAR      │    │ data       │ JSON         │
│ description│ TEXT         │    │ created_at │ TIMESTAMP    │
│ file_url   │ VARCHAR      │    └────────────┴──────────────┘
│ uploaded_by│ BIGINT (FK)  │
│ created_at │ TIMESTAMP    │
└────────────┴──────────────┘
```

---

## 🔄 Component Interaction Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                          FRONTEND LAYER                               │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                      React Components                          │  │
│  │                                                                 │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │  │
│  │  │ Patient  │  │  Doctor  │  │ Pharmacy │  │  Admin   │     │  │
│  │  │Dashboard │  │Dashboard │  │Dashboard │  │Dashboard │     │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘     │  │
│  │       │             │             │             │            │  │
│  └───────┼─────────────┼─────────────┼─────────────┼────────────┘  │
│          │             │             │             │               │
│  ┌───────┼─────────────┼─────────────┼─────────────┼────────────┐  │
│  │       ▼             ▼             ▼             ▼            │  │
│  │  ┌──────────────────────────────────────────────────────┐   │  │
│  │  │              Shared Context Layer                    │   │  │
│  │  │  ┌──────────────┐  ┌──────────────┐                 │   │  │
│  │  │  │ AuthContext  │  │ SocketContext│                 │   │  │
│  │  │  │- user state  │  │- connection  │                 │   │  │
│  │  │  │- login/out   │  │- emit/listen │                 │   │  │
│  │  │  └──────────────┘  └──────────────┘                 │   │  │
│  │  └──────────────────────────────────────────────────────┘   │  │
│  │       │                          │                          │  │
│  └───────┼──────────────────────────┼──────────────────────────┘  │
│          │                          │                             │
│  ┌───────┼──────────────────────────┼──────────────────────────┐  │
│  │       ▼                          ▼                          │  │
│  │  ┌─────────────┐          ┌─────────────┐                  │  │
│  │  │ API Service │          │Socket Service│                  │  │
│  │  │  (Axios)    │          │ (Socket.IO)  │                  │  │
│  │  │             │          │              │                  │  │
│  │  │- authAPI    │          │- emit events │                  │  │
│  │  │- appointAPI │          │- listen      │                  │  │
│  │  │- prescripAPI│          │- disconnect  │                  │  │
│  │  └─────────────┘          └─────────────┘                   │  │
│  └────────┬───────────────────────────┬─────────────────────────┘  │
└───────────┼───────────────────────────┼────────────────────────────┘
            │                           │
            │ HTTP                      │ WebSocket
            │                           │
┌───────────┼───────────────────────────┼────────────────────────────┐
│           ▼                           ▼                            │
│  ┌──────────────────┐       ┌──────────────────┐                  │
│  │  REST Controller │       │  Call Server     │                  │
│  │                  │       │  (Socket.IO)     │                  │
│  │ @PostMapping     │       │                  │                  │
│  │ @GetMapping      │       │  - Events        │                  │
│  │ @PutMapping      │       │  - Rooms         │                  │
│  │                  │       │  - Signaling     │                  │
│  └────────┬─────────┘       └──────────────────┘                  │
│           │                                                        │
│           ▼                                                        │
│  ┌──────────────────┐                                             │
│  │  Service Layer   │                                             │
│  │                  │                                             │
│  │ - UserService    │                                             │
│  │ - ApptService    │                                             │
│  │ - PrescService   │                                             │
│  └────────┬─────────┘                                             │
│           │                                                        │
│           ▼                                                        │
│  ┌──────────────────┐                                             │
│  │ Repository Layer │                                             │
│  │                  │                                             │
│  │ - UserRepo       │                                             │
│  │ - ApptRepo       │                                             │
│  │ - PrescRepo      │                                             │
│  └────────┬─────────┘                                             │
│           │                                                        │
│           ▼                                                        │
│  ┌──────────────────┐                                             │
│  │  MySQL Database  │                                             │
│  └──────────────────┘                                             │
│                    BACKEND LAYER                                  │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🔥 Firebase Architecture (Migration Target)

```
┌────────────────────────────────────────────────────────────────┐
│                       REACT FRONTEND                           │
│                   (Firebase Hosting)                           │
│                 https://app.firebaseapp.com                    │
└────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │              │
                ▼             ▼              ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────────┐
│ Firebase Auth    │  │  Firestore   │  │ Cloud Functions  │
│                  │  │  Database    │  │                  │
│ - Email/Password │  │              │  │ - bookAppt()     │
│ - User tokens    │  │ Collections: │  │ - createRx()     │
│ - Social login   │  │ - users      │  │ - generateToken()│
│                  │  │ - appts      │  │                  │
└──────────────────┘  │ - prescr     │  └──────────────────┘
                      │ - medicines  │
                      │              │
┌──────────────────┐  │ Real-time    │  ┌──────────────────┐
│ Realtime DB      │  │ Updates      │  │  Cloud Storage   │
│                  │  │              │  │                  │
│ - Presence       │  └──────────────┘  │ - Health records │
│ - Online doctors │                    │ - Prescriptions  │
│ - Chat messages  │                    │ - Profile pics   │
└──────────────────┘                    └──────────────────┘
        │
        │
        ▼
┌──────────────────┐                    ┌──────────────────┐
│  Agora SDK       │                    │ Firebase         │
│  (Video Calls)   │                    │ Analytics        │
│                  │                    │                  │
│ - WebRTC         │                    │ - User behavior  │
│ - Screen share   │                    │ - Events         │
│ - Recording      │                    │ - Crash reports  │
└──────────────────┘                    └──────────────────┘
```

---

## 🔐 Security Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                              │
└─────────────────────────────────────────────────────────────────┘

Level 1: Frontend Authentication
┌─────────────────────────────────────────────────────────────────┐
│  React AuthContext                                              │
│  - Check if user logged in                                      │
│  - Validate token in localStorage                               │
│  - Redirect to login if not authenticated                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
Level 2: Protected Routes
┌─────────────────────────────────────────────────────────────────┐
│  Route Guards                                                   │
│  - Role-based access control                                    │
│  - Patient can only access /patient/* routes                    │
│  - Doctor can only access /doctor/* routes                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
Level 3: API Request (with Headers)
┌─────────────────────────────────────────────────────────────────┐
│  HTTP Request Headers                                           │
│  Authorization: Bearer <token>                                  │
│  Content-Type: application/json                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
Level 4: Backend Security Filter
┌─────────────────────────────────────────────────────────────────┐
│  Spring Security                                                │
│  - CORS validation                                              │
│  - Token verification                                           │
│  - Extract user from token                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
Level 5: Controller Authorization
┌─────────────────────────────────────────────────────────────────┐
│  @PreAuthorize("hasRole('DOCTOR')")                             │
│  - Check user role                                              │
│  - Allow or deny request                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
Level 6: Service Layer Validation
┌─────────────────────────────────────────────────────────────────┐
│  Business Logic Checks                                          │
│  - Verify user owns the resource                                │
│  - Validate input data                                          │
│  - Check business rules                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
Level 7: Database (JPA Security)
┌─────────────────────────────────────────────────────────────────┐
│  Parameterized Queries                                          │
│  - SQL injection prevention                                     │
│  - Prepared statements                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 User Journey Maps

### Patient Journey: Book Appointment

```
START
  │
  ├─> Login to Patient Dashboard
  │
  ├─> Navigate to "Doctors" page
  │   │
  │   ├─> View list of available doctors
  │   ├─> Filter by specialization
  │   └─> See online status (green dot)
  │
  ├─> Select a doctor
  │   │
  │   └─> View doctor profile
  │       ├─> Specialization
  │       ├─> License number
  │       ├─> Availability
  │       └─> Rating
  │
  ├─> Click "Book Appointment"
  │   │
  │   └─> Fill form:
  │       ├─> Select date & time
  │       ├─> Describe symptoms
  │       └─> Choose consultation type (VIDEO/AUDIO)
  │
  ├─> Submit appointment request
  │   │
  │   ├─> Request sent to backend
  │   ├─> Saved to database
  │   └─> Notification to doctor
  │
  ├─> See confirmation message
  │   │
  │   └─> Status: "PENDING"
  │
  ├─> Wait for doctor approval
  │   │
  │   ├─> Receive notification when approved
  │   └─> Status changes to "APPROVED"
  │
  ├─> At appointment time:
  │   │
  │   ├─> Click "Join Call"
  │   ├─> WebRTC connection established
  │   └─> Video consultation begins
  │
END
```

### Doctor Journey: Accept Consultation

```
START
  │
  ├─> Login to Doctor Dashboard
  │
  ├─> Toggle "Available" status ON
  │   │
  │   ├─> Emit 'doctor_online' to Call Server
  │   └─> Green dot appears to all patients
  │
  ├─> See notification: "New consultation request"
  │   │
  │   └─> View request details:
  │       ├─> Patient name
  │       ├─> Symptoms
  │       └─> Request time
  │
  ├─> Click "Accept"
  │   │
  │   ├─> Update appointment status to APPROVED
  │   ├─> Notify patient
  │   └─> Generate call room ID
  │
  ├─> Click "Start Call"
  │   │
  │   ├─> Join Socket.IO room
  │   ├─> Exchange WebRTC signals
  │   └─> Video connection established
  │
  ├─> During consultation:
  │   │
  │   ├─> Video/Audio streaming
  │   ├─> Take notes
  │   └─> Review patient history
  │
  ├─> After consultation:
  │   │
  │   ├─> Click "Create Prescription"
  │   │   │
  │   │   └─> Fill form:
  │   │       ├─> Medicine name
  │   │       ├─> Dosage
  │   │       ├─> Duration
  │   │       └─> Instructions
  │   │
  │   ├─> Submit prescription
  │   │   │
  │   │   ├─> Saved to database
  │   │   └─> Notification to patient
  │   │
  │   └─> Mark appointment as COMPLETED
  │
END
```

---

## 🌐 Network Architecture

```
INTERNET
    │
    │ HTTPS Traffic
    │
    ▼
┌─────────────────────────────────────┐
│  Load Balancer / CDN                │
│  - SSL Termination                  │
│  - DDoS Protection                  │
│  - Rate Limiting                    │
└─────────────────────────────────────┘
    │
    ├──────────────┬──────────────┬──────────────┐
    │              │              │              │
    ▼              ▼              ▼              ▼
┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
│Frontend│    │Backend │    │Backend │    │  Call  │
│Server 1│    │Server 1│    │Server 2│    │ Server │
│        │    │        │    │        │    │        │
│Port    │    │Port    │    │Port    │    │Port    │
│5173    │    │8080    │    │8080    │    │5002    │
└────────┘    └────────┘    └────────┘    └────────┘
                  │              │
                  └──────┬───────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Database       │
                │  Cluster        │
                │                 │
                │  Primary: 3306  │
                │  Replicas: R/O  │
                └─────────────────┘
```

---

## 📦 Deployment Pipeline

```
┌──────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT                                   │
│                                                                   │
│  Developer's Local Machine                                       │
│  ├─> Code changes                                                │
│  ├─> Local testing                                               │
│  └─> Git commit                                                  │
└──────────────────────────────────────────────────────────────────┘
                         │
                         │ git push
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    VERSION CONTROL                               │
│                                                                   │
│  GitHub Repository                                               │
│  ├─> Store code                                                  │
│  ├─> Branch management                                           │
│  └─> Trigger CI/CD                                              │
└──────────────────────────────────────────────────────────────────┘
                         │
                         │ webhook
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE                                │
│                                                                   │
│  GitHub Actions / Jenkins                                        │
│  ├─> Run tests                                                   │
│  ├─> Build application                                           │
│  │   ├─> Frontend: npm run build                                │
│  │   └─> Backend: mvn clean package                             │
│  ├─> Create Docker images                                        │
│  └─> Push to registry                                           │
└──────────────────────────────────────────────────────────────────┘
                         │
                         │ deploy
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    STAGING ENVIRONMENT                           │
│                                                                   │
│  Pre-production Testing                                          │
│  ├─> Deploy containers                                           │
│  ├─> Run integration tests                                       │
│  ├─> Manual QA testing                                           │
│  └─> Performance testing                                         │
└──────────────────────────────────────────────────────────────────┘
                         │
                         │ promote
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    PRODUCTION                                    │
│                                                                   │
│  Live Environment                                                │
│  ├─> Blue-Green deployment                                       │
│  ├─> Health checks                                               │
│  ├─> Monitoring                                                  │
│  └─> Auto-scaling                                                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Takeaways

### Current Architecture Strengths ✅
1. **Separation of Concerns**: Frontend, Backend, Call Server
2. **RESTful API Design**: Standard HTTP methods, clear endpoints
3. **Real-time Capabilities**: WebSocket + Socket.IO for live features
4. **Role-based Security**: 4 distinct user roles with appropriate permissions
5. **Scalable Database**: Normalized relational schema
6. **Modern Frontend**: React with TypeScript for type safety
7. **Component-based UI**: Reusable Shadcn components

### Firebase Migration Benefits 🔥
1. **No Server Management**: Serverless architecture
2. **Auto-scaling**: Handles traffic spikes automatically
3. **Integrated Services**: Auth, DB, Storage, Functions in one place
4. **Real-time by Default**: Firestore provides instant updates
5. **Global CDN**: Fast content delivery worldwide
6. **Cost-effective**: Pay only for what you use
7. **Built-in Security**: Security rules at database level

---

**Document Purpose**: Visual reference for MeDora architecture  
**Version**: 1.0  
**Last Updated**: March 1, 2026
