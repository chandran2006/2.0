# MeDora - TeleMedicine Application

A comprehensive healthcare platform enabling remote consultations, appointment booking, prescription management, and medicine distribution.

## Features

- **4 User Roles**: Patient, Doctor, Pharmacy, Admin
- **Real-time Video/Audio Calls**: WebRTC-based consultations
- **Appointment Management**: Book, approve, and track appointments
- **Prescription System**: Create, manage, and fulfill prescriptions
- **Medicine Search**: Find medicines and check availability
- **Pharmacy Finder**: Locate nearby pharmacies
- **Symptom Checker**: AI-powered health analysis
- **Real-time Notifications**: WebSocket-based instant updates

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.5.5
- Spring Data JPA
- Spring Security
- Spring WebSocket
- H2 Database (Development)
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- Axios
- Socket.IO Client

### Call Server
- Node.js
- Express
- Socket.IO
- WebRTC

## Quick Start

### Prerequisites
- Java 17+
- Node.js 16+
- Maven 3.6+

### Backend Setup
```bash
cd projectbackend
mvnw clean install
mvnw spring-boot:run
```
Backend runs on: http://localhost:8080

### Frontend Setup
```bash
cd project
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

### Call Server Setup
```bash
cd call-server
npm install
npm start
```
Call server runs on: http://localhost:5002

## Demo Accounts

- **Patient**: patient1@medora.com / password123
- **Doctor**: dr.sharma@medora.com / password123
- **Pharmacy**: pharmacy@medora.com / pharmacy123
- **Admin**: admin@medora.com / admin123

## Project Structure

```
MeDora/
├── projectbackend/          # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/example/projectbackend/
│   │       ├── controller/  # REST Controllers
│   │       ├── service/     # Business Logic
│   │       ├── model/       # Database Entities
│   │       ├── repository/  # JPA Repositories
│   │       └── config/      # Configuration
│   └── pom.xml
│
├── project/                 # React Frontend
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── contexts/        # Global State
│   │   ├── services/        # API Services
│   │   └── types/           # TypeScript Types
│   └── package.json
│
└── call-server/             # WebRTC Call Server
    ├── server.js
    └── package.json
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Appointments
- GET `/api/appointments/doctors` - Get all doctors
- POST `/api/appointments/book` - Book appointment
- GET `/api/appointments/patient/{id}` - Get patient appointments
- PUT `/api/appointments/{id}/approve` - Approve appointment

### Prescriptions
- POST `/api/prescriptions/create` - Create prescription
- GET `/api/prescriptions/patient/{id}` - Get patient prescriptions

### Medicines
- GET `/api/medicines/search?q={query}` - Search medicines
- POST `/api/medicines/create` - Add medicine

### Calls
- POST `/api/calls/initiate` - Start call
- POST `/api/calls/doctor/online` - Doctor goes online
- GET `/api/calls/doctors/available` - Get available doctors

## Database Schema

- **users** - User accounts (all roles)
- **appointments** - Appointment records
- **prescriptions** - Prescription records
- **medicines** - Medicine inventory
- **pharmacies** - Pharmacy information
- **calls** - Call history
- **health_records** - Patient health records

## Real-time Events

- `doctor_online` - Doctor availability status
- `consultation_request` - Patient requests consultation
- `consultation_accepted` - Doctor accepts consultation
- `prescription_added` - New prescription created
- `join-room` - Join video call room
- `offer/answer/ice-candidate` - WebRTC signaling

## License

MIT License

## Author

MeDora Team
"# 2.0" 
