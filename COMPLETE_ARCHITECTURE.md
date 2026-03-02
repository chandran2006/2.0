# 🏗️ MeDora - Complete System Architecture & Implementation Guide

## 📋 Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Technology Stack](#technology-stack)
4. [Architecture Components](#architecture-components)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Real-time Communication](#real-time-communication)
8. [User Roles & Features](#user-roles--features)
9. [Frontend Architecture](#frontend-architecture)
10. [Backend Architecture](#backend-architecture)
11. [Security Implementation](#security-implementation)
12. [Firebase Migration Guide](#firebase-migration-guide)
13. [Deployment Architecture](#deployment-architecture)

---

## 📊 Executive Summary

**MeDora** is a comprehensive **TeleMedicine Platform** that connects patients with healthcare providers through a digital ecosystem. The application supports **4 distinct user roles** (Patient, Doctor, Pharmacy, Admin) with real-time video consultations, appointment management, prescription handling, and medicine delivery coordination.

### Key Statistics
- **3 Microservices**: Backend API, Frontend, Call Server
- **9 Database Tables**: Users, Appointments, Prescriptions, Medicines, etc.
- **30+ API Endpoints**: RESTful architecture
- **Real-time Features**: WebRTC video calls, Socket.IO notifications
- **4 User Dashboards**: Role-based access control
- **20+ Frontend Pages**: Comprehensive user interface

---

## 🌐 System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Frontend (Port 5173)                               │  │
│  │  - TypeScript + Vite                                      │  │
│  │  - TailwindCSS + Shadcn UI                                │  │
│  │  - React Router (SPA)                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │               │
                ▼              ▼               ▼
┌────────────────────┐  ┌──────────────┐  ┌─────────────────┐
│  REST API Server   │  │  WebSocket   │  │  Call Server    │
│  (Port 8080)       │  │  (Port 8080) │  │  (Port 5002)    │
│  Spring Boot       │  │  STOMP/WS    │  │  Socket.IO      │
└────────────────────┘  └──────────────┘  └─────────────────┘
         │                                         │
         │                                         │
         ▼                                         ▼
┌────────────────────┐                  ┌─────────────────┐
│  MySQL Database    │                  │  WebRTC P2P     │
│  (Port 3306)       │                  │  Video/Audio    │
│  - Users           │                  └─────────────────┘
│  - Appointments    │
│  - Prescriptions   │
│  - Medicines       │
└────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Framework |
| **TypeScript** | 5.8.3 | Type Safety |
| **Vite** | 5.4.19 | Build Tool & Dev Server |
| **React Router** | 6.30.1 | Client-side Routing |
| **TailwindCSS** | 3.4.17 | Utility-first CSS |
| **Shadcn UI** | Latest | Component Library (Radix UI) |
| **Axios** | 1.7.2 | HTTP Client |
| **Socket.IO Client** | 4.7.2 | Real-time Communication |
| **React Query** | 5.83.0 | Server State Management |
| **React Hook Form** | 7.61.1 | Form Management |
| **Zod** | 3.25.76 | Schema Validation |
| **Framer Motion** | 11.18.2 | Animations |
| **Lucide React** | 0.462.0 | Icons |
| **Recharts** | 2.15.4 | Charts & Analytics |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 17 | Programming Language |
| **Spring Boot** | 3.5.5 | Application Framework |
| **Spring Data JPA** | 3.5.5 | ORM & Database Access |
| **Spring Security** | 3.5.5 | Authentication & Authorization |
| **Spring WebSocket** | 3.5.5 | WebSocket Support |
| **MySQL** | 8.0+ | Relational Database |
| **H2 Database** | Latest | Development/Testing Database |
| **Lombok** | Latest | Boilerplate Code Reduction |
| **Maven** | 3.6+ | Build Tool |

### Call Server Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 16+ | Runtime Environment |
| **Express** | 4.18.2 | Web Framework |
| **Socket.IO** | 4.7.2 | WebSocket Server |
| **CORS** | 2.8.5 | Cross-Origin Support |

### Development Tools
- **VS Code**: Primary IDE
- **Postman**: API Testing
- **MySQL Workbench**: Database Management
- **Git**: Version Control

---

## 🏛️ Architecture Components

### 1. Frontend Application (React SPA)

**Location**: `/project/`

**Key Directories**:
```
project/src/
├── components/          # Reusable UI Components
│   ├── dashboards/     # Role-specific dashboards
│   ├── shared/         # Shared layouts
│   └── ui/             # 50+ Shadcn UI components
├── contexts/           # React Context (Auth, Theme)
├── hooks/              # Custom React Hooks
├── pages/              # Route Pages
│   ├── patient/       # Patient-specific pages
│   ├── doctor/        # Doctor-specific pages
│   ├── pharmacy/      # Pharmacy-specific pages
│   └── admin/         # Admin-specific pages
├── services/          # API & Socket Services
├── types/             # TypeScript Interfaces
└── lib/               # Utility Functions
```

**Build Configuration**:
- **Vite** for fast HMR (Hot Module Replacement)
- **SWC** for fast TypeScript compilation
- **PostCSS** with TailwindCSS
- **ESLint** for code quality

### 2. Backend API Server (Spring Boot)

**Location**: `/projectbackend/`

**Package Structure**:
```
com.example.projectbackend/
├── ProjectbackendApplication.java  # Main Entry Point
├── config/                         # Configuration Classes
│   ├── CorsConfig.java            # CORS Settings
│   ├── SecurityConfig.java        # Security & Auth
│   ├── WebSocketConfig.java       # WebSocket Config
│   └── DataInitializer.java       # Seed Data
├── controller/                     # REST Controllers
│   ├── AuthController.java        # Login/Register
│   ├── AppointmentController.java # Appointments
│   ├── PrescriptionController.java# Prescriptions
│   ├── MedicineController.java    # Medicine Search
│   ├── PharmacyController.java    # Pharmacy Locator
│   ├── CallController.java        # Video Call Init
│   ├── WebRTCController.java      # WebRTC Signaling
│   └── SymptomController.java     # Symptom Checker
├── model/                          # JPA Entities
│   ├── User.java                  # User Entity
│   ├── Appointment.java           # Appointment Entity
│   ├── Prescription.java          # Prescription Entity
│   ├── Medicine.java              # Medicine Entity
│   ├── Pharmacy.java              # Pharmacy Entity
│   ├── Call.java                  # Call History
│   ├── HealthRecord.java          # Medical Records
│   ├── Report.java                # Analytics Reports
│   └── DoctorAvailability.java    # Doctor Schedule
├── repository/                     # JPA Repositories
│   └── (Auto-generated by Spring Data JPA)
└── service/                        # Business Logic
    ├── UserService.java           # User Management
    ├── AppointmentService.java    # Appointment Logic
    ├── PrescriptionService.java   # Prescription Logic
    ├── MedicineService.java       # Medicine Logic
    ├── PharmacyService.java       # Pharmacy Logic
    └── CallService.java           # Call Management
```

### 3. Call Server (Node.js + Socket.IO)

**Location**: `/call-server/`

**Purpose**: Handles real-time signaling for WebRTC video/audio calls

**Key Features**:
- Socket.IO connection management
- Doctor online/offline status tracking
- Consultation request routing
- WebRTC offer/answer exchange
- ICE candidate exchange
- Room management for calls

**Server Events**:
```javascript
// Doctor Events
- doctor_online         // Doctor marks themselves available
- doctor_offline        // Doctor goes offline
- get_online_doctors    // Get list of available doctors

// Patient Events  
- patient_online        // Patient connects
- consultation_request  // Patient requests consultation

// Call Events
- offer                 // WebRTC offer
- answer                // WebRTC answer
- ice-candidate         // ICE candidate exchange
- join-room             // Join video call room
- leave-room            // Leave video call room
- call-ended            // Call termination
```

---

## 🗄️ Database Schema

### Database: `medora` (MySQL)

### Table: `users`
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role ENUM('PATIENT', 'DOCTOR', 'PHARMACY', 'ADMIN') NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(500),
    specialization VARCHAR(255),      -- For DOCTOR
    license_number VARCHAR(100),      -- For DOCTOR
    pharmacy_name VARCHAR(255),       -- For PHARMACY
    is_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_role (role),
    INDEX idx_email (email)
);
```

### Table: `appointments`
```sql
CREATE TABLE appointments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED', 'REJECTED') DEFAULT 'PENDING',
    symptoms TEXT,
    notes TEXT,
    consultation_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_status (status)
);
```

### Table: `prescriptions`
```sql
CREATE TABLE prescriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    medicine_id BIGINT,
    medicine_name VARCHAR(255),
    dosage VARCHAR(100),
    duration VARCHAR(100),
    instructions TEXT,
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
    is_taken BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    FOREIGN KEY (medicine_id) REFERENCES medicines(id),
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_status (status)
);
```

### Table: `medicines`
```sql
CREATE TABLE medicines (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    manufacturer VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    stock INT DEFAULT 0,
    requires_prescription BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_category (category)
);
```

### Table: `pharmacies`
```sql
CREATE TABLE pharmacies (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    phone VARCHAR(20),
    email VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(3, 2),
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_location (latitude, longitude)
);
```

### Table: `calls`
```sql
CREATE TABLE calls (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    duration INT,
    status VARCHAR(50),
    call_type VARCHAR(50),
    room_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id)
);
```

### Table: `health_records`
```sql
CREATE TABLE health_records (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    record_type VARCHAR(100),
    title VARCHAR(255),
    description TEXT,
    file_url VARCHAR(500),
    uploaded_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    INDEX idx_patient (patient_id)
);
```

### Table: `doctor_availability`
```sql
CREATE TABLE doctor_availability (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    doctor_id BIGINT NOT NULL,
    day_of_week VARCHAR(20),
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users(id),
    INDEX idx_doctor (doctor_id)
);
```

### Table: `reports`
```sql
CREATE TABLE reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    report_type VARCHAR(100),
    generated_by BIGINT,
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES users(id)
);
```

---

## 🔌 API Endpoints

### Base URL: `http://localhost:8080/api`

### Authentication APIs

#### POST `/auth/register`
Register a new user
```json
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "PATIENT",
  "phone": "+1234567890"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "PATIENT"
  }
}
```

#### POST `/auth/login`
User authentication
```json
Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "PATIENT",
    "phone": "+1234567890",
    "address": "123 Main St",
    "createdAt": "2024-01-01T00:00:00"
  },
  "token": "jwt-token-here"
}
```

### Appointment APIs

#### GET `/appointments/doctors`
Get list of all doctors
```json
Response:
[
  {
    "id": 2,
    "name": "Dr. Sarah Sharma",
    "email": "dr.sharma@teleasha.com",
    "specialization": "Cardiology",
    "licenseNumber": "MED12345",
    "isAvailable": true
  }
]
```

#### POST `/appointments/book`
Book a new appointment
```json
Request Body:
{
  "patientId": 1,
  "doctorId": 2,
  "appointmentDate": "2024-03-15T10:00:00",
  "symptoms": "Chest pain and shortness of breath",
  "consultationType": "VIDEO"
}

Response:
{
  "id": 10,
  "patientId": 1,
  "doctorId": 2,
  "appointmentDate": "2024-03-15T10:00:00",
  "status": "PENDING",
  "createdAt": "2024-03-01T08:00:00"
}
```

#### GET `/appointments/patient/{patientId}`
Get patient appointments

#### GET `/appointments/doctor/{doctorId}`
Get doctor appointments

#### PUT `/appointments/{id}/approve`
Approve appointment

#### PUT `/appointments/{id}/cancel`
Cancel appointment

### Prescription APIs

#### POST `/prescriptions/create`
Create prescription
```json
Request Body:
{
  "patientId": 1,
  "doctorId": 2,
  "medicineName": "Aspirin",
  "dosage": "100mg",
  "duration": "30 days",
  "instructions": "Take once daily after meals"
}
```

#### GET `/prescriptions/patient/{patientId}`
Get patient prescriptions

#### GET `/prescriptions/doctor/{doctorId}`
Get doctor prescriptions

#### PUT `/prescriptions/{id}/status`
Update prescription status

### Medicine APIs

#### GET `/medicines/search?q={query}`
Search medicines by name

#### GET `/medicines`
Get all medicines

#### POST `/medicines/create`
Add new medicine (Admin/Pharmacy)

#### PUT `/medicines/{id}`
Update medicine

### Pharmacy APIs

#### GET `/pharmacies`
Get all pharmacies

#### GET `/pharmacies/nearby?lat={lat}&lng={lng}`
Get nearby pharmacies based on location

### Call APIs

#### POST `/calls/initiate`
Initiate video call
```json
Request Body:
{
  "patientId": 1,
  "doctorId": 2,
  "callType": "VIDEO"
}
```

#### POST `/calls/doctor/online`
Mark doctor as online

#### POST `/calls/doctor/offline`
Mark doctor as offline

#### GET `/calls/doctors/available`
Get available doctors for instant consultation

### Health Record APIs

#### GET `/health-records/patient/{patientId}`
Get patient health records

#### POST `/health-records`
Upload health record

### Symptom Checker API

#### POST `/symptoms/check`
AI-powered symptom analysis

---

## ⚡ Real-time Communication

### WebSocket Implementation

#### 1. Spring WebSocket (Backend)
**Configuration**: `WebSocketConfig.java`
- STOMP messaging protocol
- Message broker for notifications
- Session management

**Endpoints**:
- `/ws` - WebSocket connection endpoint
- `/topic/notifications` - Broadcast notifications
- `/queue/private` - Private messages

#### 2. Socket.IO (Call Server)
**Port**: 5002

**Connection Flow**:
```javascript
// Frontend connects
const socket = io('http://localhost:5002');

// Doctor goes online
socket.emit('doctor_online', {
  doctorId: 2,
  name: 'Dr. Sarah',
  specialization: 'Cardiology'
});

// Listen for consultation requests
socket.on('consultation_request', (data) => {
  // Show notification to doctor
});
```

### WebRTC Video Call Flow

```
PATIENT                    CALL SERVER                    DOCTOR
   |                            |                            |
   |--1. consultation_request-->|                            |
   |                            |--2. notification---------->|
   |                            |                            |
   |                            |<--3. accept----------------|
   |<--4. call_accepted---------|                            |
   |                            |                            |
   |--5. join-room------------->|<--6. join-room-------------|
   |                            |                            |
   |--7. offer----------------->|--8. offer----------------->|
   |                            |                            |
   |<--9. answer----------------|<--10. answer---------------|
   |                            |                            |
   |--11. ice-candidate-------->|--12. ice-candidate-------->|
   |                            |                            |
   |<========= WebRTC P2P Connection Established ==========>|
   |                            |                            |
```

---

## 👥 User Roles & Features

### 1. PATIENT Role
**Features**:
- ✅ Book appointments with doctors
- ✅ View/cancel appointments
- ✅ Instant video consultations
- ✅ View prescriptions
- ✅ Search medicines
- ✅ Find nearby pharmacies
- ✅ Upload health records
- ✅ Symptom checker
- ✅ View doctors by specialization

**Pages**:
- `/patient/appointments` - Appointment management
- `/patient/prescriptions` - Prescription history
- `/patient/doctors` - Browse doctors
- `/patient/pharmacy` - Pharmacy locator
- `/patient/medicines` - Medicine search
- `/patient/health-records` - Medical records
- `/patient/symptom-checker` - AI symptom analysis

### 2. DOCTOR Role
**Features**:
- ✅ View appointment requests
- ✅ Approve/reject appointments
- ✅ Manage availability status
- ✅ Accept instant consultations
- ✅ Video/audio consultations
- ✅ Create prescriptions
- ✅ View patient history
- ✅ Manage schedule

**Pages**:
- `/doctor/appointments` - Appointment management
- `/doctor/consultation-requests` - Instant consultation queue
- `/doctor/patients` - Patient list
- `/doctor/prescriptions` - Prescription management
- `/doctor/consultations` - Consultation history
- `/doctor/schedule` - Availability management

### 3. PHARMACY Role
**Features**:
- ✅ Manage medicine inventory
- ✅ Process prescription orders
- ✅ Track medicine stock
- ✅ View sales analytics
- ✅ Update pharmacy details

**Pages**:
- `/pharmacy/inventory` - Stock management
- `/pharmacy/orders` - Order processing
- `/pharmacy/prescriptions` - Prescription fulfillment
- `/pharmacy/sales` - Sales dashboard
- `/pharmacy/settings` - Pharmacy settings

### 4. ADMIN Role
**Features**:
- ✅ User management (CRUD)
- ✅ System analytics
- ✅ Generate reports
- ✅ Monitor system health
- ✅ Manage medicines
- ✅ Manage pharmacies

**Pages**:
- `/admin/users` - User management
- `/admin/analytics` - Platform analytics
- `/admin/reports` - Report generation
- `/admin/settings` - System settings

---

## 💻 Frontend Architecture

### Component Structure

#### 1. Route Components (`/pages`)
**Public Routes**:
- `/` - Landing page (Index.tsx)
- `/login` - Login page
- `/signup` - Registration page
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/contact` - Contact page

**Protected Routes** (Role-based access):
- `/dashboard` - Role-based dashboard redirect

#### 2. Dashboard Components (`/components/dashboards`)
```typescript
// PatientDashboard.tsx
- Quick stats (appointments, prescriptions)
- Upcoming appointments
- Recent prescriptions
- Quick actions (book appointment, find doctor)

// DoctorDashboard.tsx
- Today's appointments
- Pending requests
- Consultation history
- Online status toggle

// PharmacyDashboard.tsx
- Pending orders
- Low stock alerts
- Sales overview
- Recent prescriptions

// AdminDashboard.tsx
- System statistics
- User analytics
- Recent activity
- System health
```

#### 3. UI Components (`/components/ui`)
50+ Shadcn UI components:
- Button, Card, Dialog, Dropdown
- Form, Input, Select, Textarea
- Table, Toast, Tooltip, Avatar
- Badge, Checkbox, Radio, Switch
- Tabs, Accordion, Collapsible
- Alert, Progress, Skeleton
- Calendar, DatePicker, etc.

### State Management

#### 1. AuthContext (`/contexts/AuthContext.tsx`)
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email, password) => Promise<boolean>;
  register: (userData) => Promise<boolean>;
  logout: () => void;
}
```

**Features**:
- User authentication state
- Persistent login (localStorage)
- Role-based access control
- Auto logout on token expiry

#### 2. React Query
- Server state caching
- Automatic refetching
- Optimistic updates
- Mutation handling

### API Service Layer (`/services`)

#### api.ts
- Centralized API calls
- Axios instance configuration
- Request/response interceptors
- Error handling

#### socket.ts
- Socket.IO client wrapper
- Event emission
- Event listeners
- Connection management

### Routing Strategy

```typescript
// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};
```

---

## 🏗️ Backend Architecture

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Controller Layer                 │  ← REST Endpoints
│  (HTTP Request/Response Handling)        │
└─────────────────────────────────────────┘
                   │
┌─────────────────────────────────────────┐
│         Service Layer                    │  ← Business Logic
│  (Business Rules, Validation)           │
└─────────────────────────────────────────┘
                   │
┌─────────────────────────────────────────┐
│         Repository Layer                 │  ← Data Access
│  (JPA, Database Operations)             │
└─────────────────────────────────────────┘
                   │
┌─────────────────────────────────────────┐
│         Database (MySQL)                 │  ← Persistent Storage
└─────────────────────────────────────────┘
```

### Spring Boot Configuration

#### application.properties
```properties
# Server Configuration
server.port=8080
server.address=0.0.0.0

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/medora
spring.datasource.username=root
spring.datasource.password=****
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# MySQL Dialect
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### Security Configuration

#### SecurityConfig.java
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http
            .csrf().disable()
            .cors().and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/doctor/**").hasRole("DOCTOR")
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
```

### Data Initialization

#### DataInitializer.java
Automatically creates demo accounts on startup:
- **Patient**: patient1@teleasha.com / password123
- **Doctor**: dr.sharma@teleasha.com / password123
- **Pharmacy**: pharmacy@teleasha.com / pharmacy123
- **Admin**: admin@teleasha.com / admin123

---

## 🔒 Security Implementation

### 1. Authentication
- Spring Security with HTTP Basic Auth
- Password encryption (BCrypt)
- Session management
- CSRF protection (disabled for API)

### 2. Authorization
- Role-based access control (RBAC)
- Method-level security
- URL pattern matching
- Custom access denied handlers

### 3. CORS Configuration
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);
        return source;
    }
}
```

### 4. Data Validation
- Bean Validation (JSR-380)
- Custom validators
- Input sanitization
- SQL injection prevention (JPA)

### 5. WebSocket Security
- STOMP authentication
- Message-level authorization
- Session validation

---

## 🔥 Firebase Migration Guide

### Current Stack vs Firebase

| Component | Current | Firebase Alternative |
|-----------|---------|---------------------|
| **Backend API** | Spring Boot | Cloud Functions |
| **Database** | MySQL | Firestore / Realtime DB |
| **Authentication** | Spring Security | Firebase Authentication |
| **Storage** | Local/S3 | Cloud Storage |
| **Real-time** | Socket.IO | Firebase Realtime Database |
| **Video Calls** | WebRTC + Socket.IO | Firebase + Agora/Twilio |
| **Hosting** | Self-hosted | Firebase Hosting |
| **Analytics** | Custom | Firebase Analytics |

### Firebase Architecture Design

```
┌─────────────────────────────────────────┐
│         React Frontend                   │
│     (Firebase Hosting)                   │
└─────────────────────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │               │
    ▼              ▼               ▼
┌──────────┐  ┌──────────┐  ┌───────────┐
│ Firebase │  │  Cloud   │  │ Firestore │
│   Auth   │  │ Functions│  │ Database  │
└──────────┘  └──────────┘  └───────────┘
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼               ▼
┌──────────┐  ┌──────────┐  ┌───────────┐
│  Cloud   │  │ Firebase │  │   Agora   │
│ Storage  │  │ Realtime │  │  (Video)  │
└──────────┘  └──────────┘  └───────────┘
```

### Step-by-Step Firebase Migration

#### 1. Create Firebase Project
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init
# Select: Hosting, Functions, Firestore, Storage
```

#### 2. Firebase Configuration (`firebase.json`)
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{
      "source": "**",
      "destination": "/index.html"
    }]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

#### 3. Firestore Database Schema

**Collections Structure**:
```javascript
// users
users/{userId}
  - email: string
  - name: string
  - role: string (PATIENT|DOCTOR|PHARMACY|ADMIN)
  - phone: string
  - address: string
  - specialization: string
  - isAvailable: boolean
  - createdAt: timestamp
  - updatedAt: timestamp

// appointments
appointments/{appointmentId}
  - patientId: string (ref to users)
  - doctorId: string (ref to users)
  - appointmentDate: timestamp
  - status: string (PENDING|APPROVED|COMPLETED|CANCELLED)
  - symptoms: string
  - notes: string
  - createdAt: timestamp

// prescriptions
prescriptions/{prescriptionId}
  - patientId: string
  - doctorId: string
  - medicineId: string
  - medicineName: string
  - dosage: string
  - duration: string
  - instructions: string
  - status: string
  - createdAt: timestamp

// medicines
medicines/{medicineId}
  - name: string
  - category: string
  - manufacturer: string
  - price: number
  - stock: number
  - requiresPrescription: boolean

// pharmacies
pharmacies/{pharmacyId}
  - name: string
  - address: string
  - phone: string
  - location: geopoint
  - rating: number
  - isOpen: boolean

// calls
calls/{callId}
  - patientId: string
  - doctorId: string
  - startTime: timestamp
  - endTime: timestamp
  - duration: number
  - status: string
  - roomId: string
```

#### 4. Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function hasRole(role) {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId) || hasRole('ADMIN');
    }
    
    // Appointments collection
    match /appointments/{appointmentId} {
      allow read: if isAuthenticated();
      allow create: if hasRole('PATIENT');
      allow update: if hasRole('DOCTOR') || hasRole('PATIENT');
      allow delete: if hasRole('ADMIN');
    }
    
    // Prescriptions collection
    match /prescriptions/{prescriptionId} {
      allow read: if isAuthenticated();
      allow create: if hasRole('DOCTOR');
      allow update: if hasRole('DOCTOR') || hasRole('PHARMACY');
      allow delete: if hasRole('DOCTOR') || hasRole('ADMIN');
    }
    
    // Medicines collection
    match /medicines/{medicineId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('PHARMACY') || hasRole('ADMIN');
    }
  }
}
```

#### 5. Firebase Authentication Setup
```typescript
// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "medora-app.firebaseapp.com",
  projectId: "medora-app",
  storageBucket: "medora-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

#### 6. Firebase Authentication Service
```typescript
// authService.ts
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export const registerUser = async (email, password, userData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user document in Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    email,
    name: userData.name,
    role: userData.role,
    phone: userData.phone,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return userCredential.user;
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = () => signOut(auth);
```

#### 7. Cloud Functions (API Replacement)
```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Example: Book Appointment
export const bookAppointment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const { doctorId, appointmentDate, symptoms } = data;
  
  const appointmentRef = await admin.firestore().collection('appointments').add({
    patientId: context.auth.uid,
    doctorId,
    appointmentDate: admin.firestore.Timestamp.fromDate(new Date(appointmentDate)),
    status: 'PENDING',
    symptoms,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return { success: true, appointmentId: appointmentRef.id };
});

// Example: Create Prescription
export const createPrescription = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  // Verify user is a doctor
  const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (userDoc.data()?.role !== 'DOCTOR') {
    throw new functions.https.HttpsError('permission-denied', 'Only doctors can create prescriptions');
  }
  
  const prescriptionRef = await admin.firestore().collection('prescriptions').add({
    doctorId: context.auth.uid,
    patientId: data.patientId,
    medicineName: data.medicineName,
    dosage: data.dosage,
    duration: data.duration,
    instructions: data.instructions,
    status: 'ACTIVE',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return { success: true, prescriptionId: prescriptionRef.id };
});

// Firestore Trigger: Send notification on new appointment
export const onAppointmentCreated = functions.firestore
  .document('appointments/{appointmentId}')
  .onCreate(async (snap, context) => {
    const appointment = snap.data();
    
    // Send notification to doctor
    await admin.firestore().collection('notifications').add({
      userId: appointment.doctorId,
      type: 'NEW_APPOINTMENT',
      message: 'You have a new appointment request',
      appointmentId: context.params.appointmentId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
```

#### 8. Realtime Features with Firestore
```typescript
// Listen to appointment updates
import { onSnapshot, collection, query, where } from 'firebase/firestore';

const listenToPatientAppointments = (patientId, callback) => {
  const q = query(
    collection(db, 'appointments'),
    where('patientId', '==', patientId)
  );
  
  return onSnapshot(q, (snapshot) => {
    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(appointments);
  });
};
```

#### 9. Video Call Integration (Agora)
```typescript
// Install Agora SDK
// npm install agora-rtc-react agora-rtc-sdk-ng

import AgoraRTC from 'agora-rtc-sdk-ng';

const APP_ID = 'YOUR_AGORA_APP_ID';

export const initializeVideoCall = async (channelName, userRole) => {
  const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
  
  // Get token from Cloud Function
  const tokenFunction = httpsCallable(functions, 'generateAgoraToken');
  const result = await tokenFunction({ channelName, role: userRole });
  const token = result.data.token;
  
  // Join channel
  await client.join(APP_ID, channelName, token, null);
  
  // Create local tracks
  const localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
  
  return { client, localTracks };
};
```

#### 10. Deploy to Firebase
```bash
# Build frontend
cd project
npm run build

# Deploy everything
firebase deploy

# Or deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

### Firebase Cost Estimation

**Free Tier (Spark Plan)**:
- Firestore: 1GB storage, 50K reads/day
- Cloud Functions: 2M invocations/month
- Storage: 5GB
- Hosting: 10GB/month
- Authentication: Unlimited

**Paid Tier (Blaze Plan - Pay as you go)**:
- Firestore: $0.18/GB storage
- Cloud Functions: $0.40/million invocations
- Bandwidth: $0.12/GB

**Estimated Monthly Cost** (1000 users):
- ~$20-50/month for moderate usage
- Scales automatically with demand

---

## 🚀 Deployment Architecture

### Current Local Setup

```
┌─────────────────────────────────────────────┐
│           Local Development                  │
├─────────────────────────────────────────────┤
│  Frontend: http://localhost:5173            │
│  Backend:  http://localhost:8080            │
│  Call Server: http://localhost:5002         │
│  MySQL:    localhost:3306                   │
└─────────────────────────────────────────────┘
```

### Production Deployment Options

#### Option 1: Traditional Cloud (AWS/Azure/GCP)

```
┌───────────────────────────────────────────────┐
│              Load Balancer (HTTPS)            │
└───────────────────────────────────────────────┘
           │                       │
    ┌──────┴──────┐         ┌─────┴──────┐
    │             │         │            │
┌───▼────┐  ┌────▼───┐  ┌──▼───┐  ┌────▼────┐
│Frontend│  │Frontend│  │Backend│  │ Backend │
│ EC2/VM │  │ EC2/VM │  │EC2/VM │  │ EC2/VM  │
└────────┘  └────────┘  └───────┘  └─────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
              ┌─────▼──────┐    ┌────▼─────┐
              │  RDS MySQL │    │  Redis   │
              └────────────┘    └──────────┘
```

**Services Required**:
- EC2/VMs for application servers
- RDS for MySQL database
- ElastiCache for Redis (caching)
- S3/Blob Storage for files
- CloudFront/CDN for static assets
- Route53/DNS for domain

#### Option 2: Container Orchestration (Kubernetes)

```
┌────────────────────────────────────────────┐
│        Kubernetes Cluster                  │
├────────────────────────────────────────────┤
│  Pod: Frontend (3 replicas)                │
│  Pod: Backend API (5 replicas)             │
│  Pod: Call Server (3 replicas)             │
│  Pod: MySQL (StatefulSet)                  │
└────────────────────────────────────────────┘
```

#### Option 3: Serverless (Firebase/AWS Lambda)
- Minimal infrastructure management
- Auto-scaling
- Pay per use
- Suitable for this application

---

## 📊 System Metrics & Monitoring

### Key Performance Indicators (KPIs)

1. **User Metrics**
   - Total users by role
   - Active users (daily/monthly)
   - User registration rate

2. **Appointment Metrics**
   - Total appointments
   - Appointments by status
   - Average appointment duration
   - Cancellation rate

3. **Consultation Metrics**
   - Total video consultations
   - Average call duration
   - Call quality metrics
   - Doctor availability rate

4. **Prescription Metrics**
   - Total prescriptions issued
   - Fulfillment rate
   - Average prescription cost

5. **System Health**
   - API response time
   - Database connection pool
   - WebSocket connections
   - Error rate

---

## 🔧 Development & Build

### Frontend Build
```bash
cd project
npm install
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run test         # Run tests
```

### Backend Build
```bash
cd projectbackend
mvnw clean install   # Build with Maven
mvnw spring-boot:run # Run application
mvnw test            # Run tests
```

### Call Server
```bash
cd call-server
npm install
npm start            # Start server
```

### Quick Start (All Services)
```bash
# Windows
START_ALL.bat

# Manual start
# Terminal 1: Backend
cd projectbackend && mvnw spring-boot:run

# Terminal 2: Frontend
cd project && npm run dev

# Terminal 3: Call Server
cd call-server && npm start
```

---

## 🧪 Testing Strategy

### 1. Unit Tests
- **Frontend**: Vitest + React Testing Library
- **Backend**: JUnit 5 + Mockito

### 2. Integration Tests
- API endpoint testing
- Database integration tests
- WebSocket connection tests

### 3. E2E Tests
- User journey testing
- Cross-browser testing
- Mobile responsiveness

### 4. Performance Tests
- Load testing (Apache JMeter)
- Stress testing
- API response time monitoring

---

## 📈 Future Enhancements

### Phase 1: Current Implementation ✅
- User authentication & authorization
- Appointment booking system
- Video consultations
- Prescription management
- Medicine search
- Pharmacy locator

### Phase 2: Planned Features 🚧
- [ ] Payment integration (Stripe/Razorpay)
- [ ] SMS/Email notifications
- [ ] Push notifications (PWA)
- [ ] Lab test booking
- [ ] Medicine home delivery tracking
- [ ] Multi-language support
- [ ] Mobile app (React Native)

### Phase 3: Advanced Features 🔮
- [ ] AI-powered diagnosis
- [ ] Chatbot support
- [ ] Health insurance integration
- [ ] Wearable device integration
- [ ] Voice assistant
- [ ] Blockchain for medical records
- [ ] Telemedicine analytics dashboard

---

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8080/api
VITE_SOCKET_URL=http://localhost:5002
VITE_APP_NAME=MeDora
```

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/medora
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
server.port=8080
```

### Call Server (.env)
```env
PORT=5002
NODE_ENV=development
```

---

## 🛠️ Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check MySQL service
net start MySQL80

# Verify credentials in application.properties
# Create database manually
mysql -u root -p
CREATE DATABASE medora;
```

**2. CORS Errors**
- Verify CORS configuration in `CorsConfig.java`
- Check frontend API URL in `.env`

**3. Socket Connection Issues**
- Ensure call server is running on port 5002
- Check firewall settings
- Verify SOCKET_URL in frontend

**4. Port Already in Use**
```bash
# Windows - Kill process on port
netstat -ano | findstr :8080
taskkill /F /PID <PID>
```

---

## 📚 Documentation Index

### Project Documentation Files
1. `README.md` - Main project documentation
2. `PROJECT_STRUCTURE.md` - Detailed file structure
3. `QUICK_START.md` - Quick setup guide
4. `API_USAGE_EXAMPLES.md` - API examples
5. `DATABASE_FIX_GUIDE.md` - Database setup
6. `CALL_FLOW_READY.md` - Video call implementation
7. `VERIFICATION_CHECKLIST.md` - Testing checklist
8. `COMPLETE_ARCHITECTURE.md` - This file

---

## 🎯 Summary

**MeDora** is a production-ready telemedicine platform built with modern technologies:

### Architecture Highlights
- ✅ **3-Tier Architecture**: Frontend, Backend, Call Server
- ✅ **RESTful API**: 30+ endpoints
- ✅ **Real-time Communication**: WebSocket & Socket.IO
- ✅ **WebRTC Video**: Peer-to-peer video consultations
- ✅ **Role-based Access**: 4 distinct user roles
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Scalable**: Microservices-ready
- ✅ **Secure**: Spring Security + Authentication
- ✅ **Production-Ready**: Error handling, logging, validation

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Spring Boot 3.5 + JPA + MySQL
- **Real-time**: Socket.IO + WebRTC
- **Cloud-Ready**: Firebase migration path documented

### Firebase Studio Migration
This document provides complete architecture and step-by-step guide to recreate this project in Firebase:
1. Firestore for database
2. Cloud Functions for backend logic
3. Firebase Authentication for users
4. Firebase Hosting for frontend
5. Firebase Realtime Database for live features
6. Agora/Twilio for video calls

**Total Components**: 
- 9 Database Tables
- 30+ API Endpoints
- 20+ Frontend Pages
- 50+ UI Components
- 4 User Roles
- 2 Real-time Servers

---

## 📞 Support & Contact

For questions or issues:
- Check documentation files
- Review troubleshooting section
- Inspect browser console for errors
- Check backend logs

---

**Document Version**: 1.0  
**Last Updated**: March 1, 2026  
**Project**: MeDora TeleMedicine Platform  
**Status**: Production Ready ✅
