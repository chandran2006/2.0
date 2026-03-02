# 🔥 Firebase Implementation Guide - MeDora TeleMedicine

## 📋 Complete Step-by-Step Guide to Recreate in Firebase

---

## 🎯 Overview

This guide will help you recreate the **MeDora TeleMedicine Platform** using **Firebase** and **Google Cloud Platform** services. The migration will transform the Spring Boot backend into Firebase Cloud Functions and MySQL database into Firestore.

---

## 📦 Prerequisites

### Required Tools
```bash
# Install Node.js (v18 or higher)
node --version

# Install Firebase CLI
npm install -g firebase-tools

# Verify installation
firebase --version
```

### Required Accounts
1. **Google Account** (for Firebase Console)
2. **Firebase Project** (Blaze plan for Cloud Functions)
3. **Agora Account** (for video calls) [Optional: Twilio/Daily.co]

---

## 🚀 Step 1: Create Firebase Project

### 1.1 Firebase Console Setup
```bash
1. Go to https://console.firebase.google.com
2. Click "Add Project"
3. Enter project name: "medora-telemedicine"
4. Enable Google Analytics (optional)
5. Create project
```

### 1.2 Enable Firebase Services
In Firebase Console, enable:
- ✅ **Authentication** (Email/Password)
- ✅ **Firestore Database**
- ✅ **Cloud Functions**
- ✅ **Cloud Storage**
- ✅ **Hosting**
- ✅ **Realtime Database** (for presence/online status)

### 1.3 Upgrade to Blaze Plan
```
Firebase Console → Settings → Usage and billing → Modify plan
Select "Blaze (Pay as you go)"
```

---

## 🏗️ Step 2: Initialize Firebase Project Locally

### 2.1 Project Structure
```bash
# Create project directory
mkdir medora-firebase
cd medora-firebase

# Initialize Firebase
firebase login
firebase init

# Select these features:
# [x] Firestore
# [x] Functions
# [x] Hosting
# [x] Storage
```

### 2.2 Resulting Structure
```
medora-firebase/
├── .firebaserc
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── public/              # Will be replaced with React build
├── functions/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts
└── frontend/           # React app (we'll create this)
```

---

## 📱 Step 3: Setup React Frontend

### 3.1 Create React App with Vite
```bash
# In medora-firebase directory
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

### 3.2 Install Dependencies
```bash
# Firebase SDK
npm install firebase

# UI Libraries (same as original)
npm install react-router-dom axios
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install tailwindcss postcss autoprefixer
npm install lucide-react
npm install react-hook-form zod @hookform/resolvers
npm install @tanstack/react-query

# Video Call (Agora)
npm install agora-rtc-react agora-rtc-sdk-ng
```

### 3.3 Firebase Configuration
```typescript
// frontend/src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "medora-telemedicine.firebaseapp.com",
  projectId: "medora-telemedicine",
  storageBucket: "medora-telemedicine.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://medora-telemedicine-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const realtimeDb = getDatabase(app);

export default app;
```

### 3.4 TailwindCSS Setup
```bash
# Initialize Tailwind
npx tailwindcss init -p
```

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## 🔐 Step 4: Implement Authentication

### 4.1 Enable Email/Password Authentication
```
Firebase Console → Authentication → Sign-in method
→ Enable "Email/Password"
```

### 4.2 Authentication Service
```typescript
// frontend/src/services/authService.ts
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'PHARMACY' | 'ADMIN';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  specialization?: string;
  licenseNumber?: string;
  pharmacyName?: string;
  isAvailable?: boolean;
  createdAt: Date;
}

// Register new user
export const registerUser = async (
  email: string,
  password: string,
  userData: Partial<UserProfile>
): Promise<UserProfile> => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create Firestore profile
    const profile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      name: userData.name || '',
      role: userData.role || 'PATIENT',
      phone: userData.phone || '',
      address: userData.address || '',
      specialization: userData.specialization || '',
      licenseNumber: userData.licenseNumber || '',
      pharmacyName: userData.pharmacyName || '',
      isAvailable: false,
      createdAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), profile);

    return profile;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }

    return userDoc.data() as UserProfile;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// Get current user profile
export const getCurrentUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) return null;
  return userDoc.data() as UserProfile;
};

// Auth state observer
export const observeAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
```

### 4.3 Auth Context
```typescript
// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  observeAuthState,
  getCurrentUserProfile,
  UserProfile 
} from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = observeAuthState(async (authUser) => {
      setFirebaseUser(authUser);
      
      if (authUser) {
        const profile = await getCurrentUserProfile(authUser.uid);
        setUser(profile);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const profile = await loginUser(email, password);
    setUser(profile);
  };

  const register = async (email: string, password: string, userData: Partial<UserProfile>) => {
    const profile = await registerUser(email, password, userData);
    setUser(profile);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

---

## 🗄️ Step 5: Setup Firestore Database

### 5.1 Firestore Data Model

```typescript
// frontend/src/types/firestore.ts

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  APPOINTMENTS: 'appointments',
  PRESCRIPTIONS: 'prescriptions',
  MEDICINES: 'medicines',
  PHARMACIES: 'pharmacies',
  CALLS: 'calls',
  HEALTH_RECORDS: 'healthRecords',
  NOTIFICATIONS: 'notifications'
};

// Appointment interface
export interface Appointment {
  id?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: Date;
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  symptoms: string;
  notes?: string;
  consultationType: 'VIDEO' | 'AUDIO' | 'CHAT';
  createdAt: Date;
  updatedAt: Date;
}

// Prescription interface
export interface Prescription {
  id?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medicineId?: string;
  medicineName: string;
  dosage: string;
  duration: string;
  instructions: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  isTaken: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// Medicine interface
export interface Medicine {
  id?: string;
  name: string;
  category: string;
  manufacturer: string;
  description: string;
  price: number;
  stock: number;
  requiresPrescription: boolean;
  imageUrl?: string;
  createdAt: Date;
}

// Pharmacy interface
export interface Pharmacy {
  id?: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  isOpen: boolean;
  operatingHours?: string;
  createdAt: Date;
}
```

### 5.2 Firestore Service
```typescript
// frontend/src/services/firestoreService.ts
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS, Appointment, Prescription } from '../types/firestore';

// ========== APPOINTMENT SERVICES ==========

export const createAppointment = async (appointmentData: Omit<Appointment, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTIONS.APPOINTMENTS), {
    ...appointmentData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  return docRef.id;
};

export const getPatientAppointments = async (patientId: string): Promise<Appointment[]> => {
  const q = query(
    collection(db, COLLECTIONS.APPOINTMENTS),
    where('patientId', '==', patientId),
    orderBy('appointmentDate', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Appointment));
};

export const getDoctorAppointments = async (doctorId: string): Promise<Appointment[]> => {
  const q = query(
    collection(db, COLLECTIONS.APPOINTMENTS),
    where('doctorId', '==', doctorId),
    orderBy('appointmentDate', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Appointment));
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: Appointment['status']
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
  await updateDoc(docRef, {
    status,
    updatedAt: Timestamp.now()
  });
};

// ========== PRESCRIPTION SERVICES ==========

export const createPrescription = async (prescriptionData: Omit<Prescription, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTIONS.PRESCRIPTIONS), {
    ...prescriptionData,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  const q = query(
    collection(db, COLLECTIONS.PRESCRIPTIONS),
    where('patientId', '==', patientId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Prescription));
};

export const getDoctorPrescriptions = async (doctorId: string): Promise<Prescription[]> => {
  const q = query(
    collection(db, COLLECTIONS.PRESCRIPTIONS),
    where('doctorId', '==', doctorId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Prescription));
};

// ========== DOCTORS SERVICES ==========

export const getAllDoctors = async () => {
  const q = query(
    collection(db, COLLECTIONS.USERS),
    where('role', '==', 'DOCTOR')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// ========== MEDICINE SERVICES ==========

export const searchMedicines = async (searchTerm: string) => {
  // Note: Firestore doesn't support full-text search natively
  // For production, use Algolia or Elasticsearch
  const snapshot = await getDocs(collection(db, COLLECTIONS.MEDICINES));
  const medicines = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  return medicines.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const getAllMedicines = async () => {
  const snapshot = await getDocs(collection(db, COLLECTIONS.MEDICINES));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// ========== PHARMACY SERVICES ==========

export const getAllPharmacies = async () => {
  const snapshot = await getDocs(collection(db, COLLECTIONS.PHARMACIES));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### 5.3 Firestore Security Rules
```javascript
// firestore.rules
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
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    function hasRole(role) {
      return getUserData().role == role;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if true; // Allow registration
      allow update: if isOwner(userId);
      allow delete: if hasRole('ADMIN');
    }
    
    // Appointments collection
    match /appointments/{appointmentId} {
      allow read: if isAuthenticated() && (
        resource.data.patientId == request.auth.uid ||
        resource.data.doctorId == request.auth.uid ||
        hasRole('ADMIN')
      );
      allow create: if isAuthenticated() && hasRole('PATIENT');
      allow update: if isAuthenticated() && (
        resource.data.doctorId == request.auth.uid ||
        resource.data.patientId == request.auth.uid ||
        hasRole('ADMIN')
      );
      allow delete: if hasRole('ADMIN');
    }
    
   // Prescriptions collection
    match /prescriptions/{prescriptionId} {
      allow read: if isAuthenticated() && (
        resource.data.patientId == request.auth.uid ||
        resource.data.doctorId == request.auth.uid ||
        hasRole('PHARMACY') ||
        hasRole('ADMIN')
      );
      allow create: if isAuthenticated() && hasRole('DOCTOR');
      allow update: if isAuthenticated() && (
        hasRole('DOCTOR') ||
        hasRole('PHARMACY')
      );
      allow delete: if hasRole('ADMIN');
    }
    
    // Medicines collection
    match /medicines/{medicineId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('PHARMACY') || hasRole('ADMIN');
    }
    
    // Pharmacies collection
    match /pharmacies/{pharmacyId} {
      allow read: if isAuthenticated();
      allow write: if hasRole('PHARMACY') || hasRole('ADMIN');
    }
    
    // Health Records collection
    match /healthRecords/{recordId} {
      allow read: if isAuthenticated() && (
        resource.data.patientId == request.auth.uid ||
        hasRole('DOCTOR') ||
        hasRole('ADMIN')
      );
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && resource.data.patientId == request.auth.uid;
      allow delete: if hasRole('ADMIN');
    }
    
    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
      allow write: if isAuthenticated();
    }
    
    // Calls collection
    match /calls/{callId} {
      allow read, write: if isAuthenticated();
    }
  }
}
```

### 5.4 Firestore Indexes
```json
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "appointments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "patientId", "order": "ASCENDING" },
        { "fieldPath": "appointmentDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "appointments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "doctorId", "order": "ASCENDING" },
        { "fieldPath": "appointmentDate", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "prescriptions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "patientId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "prescriptions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "doctorId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]  
}
```

---

## ⚡ Step 6: Real-time Features with Firebase Realtime Database

### 6.1 Doctor Online/Offline Status
```typescript
// frontend/src/services/presenceService.ts
import { ref, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';
import { realtimeDb } from '../config/firebase';

export const setDoctorOnline = async (doctorId: string, doctorData: any) => {
  const doctorStatusRef = ref(realtimeDb, `onlineDoctors/${doctorId}`);
  
  // Set doctor as online
  await set(doctorStatusRef, {
    ...doctorData,
    status: 'online',
    lastSeen: serverTimestamp()
  });
  
  // Remove doctor when they disconnect
  onDisconnect(doctorStatusRef).remove();
};

export const setDoctorOffline = async (doctorId: string) => {
  const doctorStatusRef = ref(realtimeDb, `onlineDoctors/${doctorId}`);
  await set(doctorStatusRef, null); // Remove from online list
};

export const subscribeToOnlineDoctors = (callback: (doctors: any[]) => void) => {
  const onlineDoctorsRef = ref(realtimeDb, 'onlineDoctors');
  
  return onValue(onlineDoctorsRef, (snapshot) => {
    const doctors: any[] = [];
    snapshot.forEach((childSnapshot) => {
      doctors.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    callback(doctors);
  });
};
```

### 6.2 Realtime Database Rules
```json
// database.rules.json
{
  "rules": {
    "onlineDoctors": {
      "$doctorId": {
        ".read": true,
        ".write": "$doctorId === auth.uid"
      }
    },
    "consultationRequests": {
      "$requestId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

---

## 🎥 Step 7: Video Call Implementation (Agora)

### 7.1 Get Agora Credentials
```
1. Sign up at https://console.agora.io
2. Create a new project
3. Get App ID and App Certificate
4. Enable Token authentication
```

### 7.2 Agora Cloud Function (Token Generator)
```typescript
// functions/src/agora.ts
import * as functions from 'firebase-functions';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

const APP_ID = functions.config().agora.appid;
const APP_CERTIFICATE = functions.config().agora.appcertificate;

export const generateAgoraToken = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { channelName, role, uid } = data;
  const expirationTimeInSeconds = 3600; // 1 hour
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const userRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid || 0,
    userRole,
    privilegeExpiredTs
  );

  return { token, appId: APP_ID };
});
```

### 7.3 Agora Video Component
```typescript
// frontend/src/components/VideoCall.tsx
import { useState, useEffect } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack 
} from 'agora-rtc-sdk-ng';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface VideoCallProps {
  channelName: string;
  onLeave: () => void;
}

export const VideoCall: React.FC<VideoCallProps> = ({ channelName, onLeave }) => {
  const [client] = useState<IAgoraRTCClient>(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
  const [localTracks, setLocalTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Get Agora token from Cloud Function
        const functions = getFunctions();
        const generateToken = httpsCallable(functions, 'generateAgoraToken');
        const result = await generateToken({ 
          channelName, 
          role: 'publisher',
          uid: 0 
        });
        const { token, appId } = result.data as { token: string; appId: string };

        // Join channel
        await client.join(appId, channelName, token, null);

        // Create local tracks
        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks(tracks);

        // Publish local tracks
        await client.publish(tracks);

        // Play local video
        tracks[1].play('local-video');

        setIsJoined(true);

        // Handle remote users
        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);

          if (mediaType === 'video') {
            const remoteVideoTrack = user.videoTrack;
            remoteVideoTrack?.play('remote-video');
          }

          if (mediaType === 'audio') {
            const remoteAudioTrack = user.audioTrack;
            remoteAudioTrack?.play();
          }
        });

        client.on('user-unpublished', (user) => {
          console.log('User left:', user.uid);
        });

      } catch (error) {
        console.error('Failed to join call:', error);
      }
    };

    init();

    return () => {
      if (localTracks) {
        localTracks[0].close();
        localTracks[1].close();
      }
      client.leave();
    };
  }, [channelName, client]);

  const handleLeave = async () => {
    if (localTracks) {
      localTracks[0].close();
      localTracks[1].close();
    }
    await client.leave();
    onLeave();
  };

  return (
    <div className="video-call-container">
      <div id="local-video" style={{ width: '320px', height: '240px' }} />
      <div id="remote-video" style={{ width: '640px', height: '480px' }} />
      <button onClick={handleLeave}>Leave Call</button>
    </div>
  );
};
```

---

## ☁️ Step 8: Cloud Functions (Backend Logic)

### 8.1 Initialize Cloud Functions
```bash
cd functions
npm install
npm install agora-access-token
npm install firebase-admin firebase-functions
```

### 8.2 Main Functions File
```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// ========== APPOINTMENT FUNCTIONS ==========

export const onAppointmentCreated = functions.firestore
  .document('appointments/{appointmentId}')
  .onCreate(async (snap, context) => {
    const appointment = snap.data();
    
    // Send notification to doctor
    await admin.firestore().collection('notifications').add({
      userId: appointment.doctorId,
      type: 'NEW_APPOINTMENT',
      title: 'New Appointment Request',
      message: `${appointment.patientName} has requested an appointment`,
      appointmentId: context.params.appointmentId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // TODO: Send email notification
    return null;
  });

export const onAppointmentStatusChanged = functions.firestore
  .document('appointments/{appointmentId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== after.status) {
      // Notify patient of status change
      await admin.firestore().collection('notifications').add({
        userId: after.patientId,
        type: 'APPOINTMENT_STATUS_CHANGED',
        title: 'Appointment Status Updated',
        message: `Your appointment status changed to ${after.status}`,
        appointmentId: context.params.appointmentId,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    return null;
  });

// ========== PRESCRIPTION FUNCTIONS ==========

export const onPrescriptionCreated = functions.firestore
  .document('prescriptions/{prescriptionId}')
  .onCreate(async (snap, context) => {
    const prescription = snap.data();

    // Notify patient
    await admin.firestore().collection('notifications').add({
      userId: prescription.patientId,
      type: 'NEW_PRESCRIPTION',
      title: 'New Prescription',
      message: `Dr. ${prescription.doctorName} prescribed ${prescription.medicineName}`,
      prescriptionId: context.params.prescriptionId,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return null;
  });

// =========== CALLABLE FUNCTIONS ===========

export const bookAppointment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { doctorId, appointmentDate, symptoms, consultationType } = data;

  // Get user profile
  const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  const userData = userDoc.data();

  // Create appointment
  const appointmentRef = await admin.firestore().collection('appointments').add({
    patientId: context.auth.uid,
    patientName: userData?.name || 'Unknown',
    doctorId,
    doctorName: data.doctorName,
    appointmentDate: admin.firestore.Timestamp.fromDate(new Date(appointmentDate)),
    status: 'PENDING',
    symptoms,
    consultationType: consultationType || 'VIDEO',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true, appointmentId: appointmentRef.id };
});

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
    doctorName: userDoc.data()?.name || 'Unknown',
    patientId: data.patientId,
    patientName: data.patientName,
    medicineName: data.medicineName,
    dosage: data.dosage,
    duration: data.duration,
    instructions: data.instructions,
    status: 'ACTIVE',
    isTaken: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return { success: true, prescriptionId: prescriptionRef.id };
});

// Export Agora token generator
export * from './agora';
```

### 8.3 Deploy Cloud Functions
```bash
cd functions
npm run build
firebase deploy --only functions
```

---

## 🎨 Step 9: Complete Frontend Implementation

### 9.1 Copy Components from Original Project
```bash
# Copy all pages
cp -r ../2.0/project/src/pages/* ./frontend/src/pages/

# Copy components
cp -r ../2.0/project/src/components/* ./frontend/src/components/

# Update imports to use Firebase services instead of axios
```

### 9.2 Update API Calls
Replace all `axios` API calls with Firebase Firestore calls:

**Before (Axios)**:
```typescript
const response = await axios.get('/api/appointments/patient/1');
```

**After (Firebase)**:
```typescript
import { getPatientAppointments } from '../services/firestoreService';
const appointments = await getPatientAppointments(userId);
```

### 9.3 Build Configuration
```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '../public', // Build to Firebase hosting directory
  },
});
```

---

## 🚀 Step 10: Deploy to Firebase

### 10.1 Build Frontend
```bash
cd frontend
npm run build
```

### 10.2 Update Firebase Hosting Config
```json
// firebase.json
{
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 10.3 Deploy Everything
```bash
# Deploy all services
firebase deploy

# Or deploy individually
firebase deploy --only hosting
firebase deploy --only firestore
firebase deploy --only functions
```

### 10.4 Access Your App
```
Your app will be live at:
https://medora-telemedicine.web.app
OR
https://medora-telemedicine.firebaseapp.com
```

---

## 📊 Step 11: Seed Database with Initial Data

### 11.1 Create Seed Script
```typescript
// scripts/seedData.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Your Firebase config here
const firebaseConfig = {
  // ... config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function seedData() {
  try {
    // Create demo users
    const patientUser = await createUserWithEmailAndPassword(
      auth,
      'patient1@teleasha.com',
      'password123'
    );

    await addDoc(collection(db, 'users'), {
      uid: patientUser.user.uid,
      email: 'patient1@teleasha.com',
      name: 'John Patient',
      role: 'PATIENT',
      phone: '+1234567890',
      createdAt: new Date()
    });

    // Create demo doctor
    const doctorUser = await createUserWithEmailAndPassword(
      auth,
      'dr.sharma@teleasha.com',
      'password123'
    );

    await addDoc(collection(db, 'users'), {
      uid: doctorUser.user.uid,
      email: 'dr.sharma@teleasha.com',
      name: 'Dr. Sarah Sharma',
      role: 'DOCTOR',
      specialization: 'Cardiology',
      licenseNumber: 'MED12345',
      createdAt: new Date()
    });

    // Add medicines
    await addDoc(collection(db, 'medicines'), {
      name: 'Aspirin',
      category: 'Pain Relief',
      manufacturer: 'Generic Pharma',
      price: 5.99,
      stock: 100,
      requiresPrescription: false,
      createdAt: new Date()
    });

    console.log('Data seeded successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedData();
```

---

## 📈 Step 12: Monitoring & Analytics

### 12.1 Enable Firebase Analytics
```typescript
// frontend/src/config/firebase.ts
import { getAnalytics, logEvent } from 'firebase/analytics';

const analytics = getAnalytics(app);

// Track custom events
export const trackEvent = (eventName: string, params?: any) => {
  logEvent(analytics, eventName, params);
};
```

### 12.2 Enable Firebase Performance Monitoring
```bash
npm install firebase/performance
```

```typescript
import { getPerformance } from 'firebase/performance';
const perf = getPerformance(app);
```

---

## 💰 Cost Estimation

### Firebase Pricing (Blaze Plan)

**Monthly Costs for 1000 active users**:

| Service | Usage | Cost |
|---------|-------|------|
| Firestore | 100K reads, 50K writes | ~$0.60 |
| Cloud Functions | 500K invocations | ~$0.80 |
| Hosting | 10GB bandwidth | ~$1.50 |
| Storage | 5GB | ~$0.10 |
| Realtime DB | 1GB bandwidth | ~$1.00 |
| Agora Video | 10,000 minutes | ~$9.90 |
| **Total** | | **~$15-20/month** |

**Scaling to 10,000 users**: ~$150-200/month

---

## ✅ Checklist

- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore database configured
- [ ] Security rules deployed
- [ ] Cloud Functions deployed
- [ ] Frontend built and deployed
- [ ] Agora video calls configured
- [ ] Demo data seeded
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring enabled

---

## 🎯 Summary

You now have a complete guide to recreate the MeDora TeleMedicine platform using Firebase. The migration includes:

✅ **Authentication**: Firebase Auth with email/password  
✅ **Database**: Firestore for structured data  
✅ **Real-time**: Realtime Database for presence  
✅ **Backend Logic**: Cloud Functions  
✅ **Video Calls**: Agora SDK  
✅ **Hosting**: Firebase Hosting  
✅ **Security**: Firestore Security Rules  
✅ **Scalability**: Auto-scaling infrastructure  

**Next Steps**:
1. Follow this guide step-by-step
2. Test each feature as you implement
3. Deploy to production
4. Monitor usage and costs
5. Scale as needed

🔥 **Firebase provides a production-ready, scalable infrastructure with minimal DevOps overhead!**

---

**Document Version**: 1.0  
**Last Updated**: March 1, 2026
