# API Usage Examples - Quick Reference

## 🔐 Authentication

### Login
```typescript
import { authAPI } from '@/services/api';

const handleLogin = async () => {
  try {
    const response = await authAPI.login(email, password);
    const user = response.data.user;
    // Store user data
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Register
```typescript
const handleRegister = async () => {
  try {
    const response = await authAPI.register({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'PATIENT'
    });
    const user = response.data.user;
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

---

## 📅 Appointments

### Get All Doctors
```typescript
import { appointmentAPI } from '@/services/api';

const fetchDoctors = async () => {
  try {
    const response = await appointmentAPI.getDoctors();
    const doctors = response.data;
    setDoctors(doctors);
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
  }
};
```

### Book Appointment
```typescript
const bookAppointment = async () => {
  try {
    const response = await appointmentAPI.bookAppointment({
      patientId: 1,
      doctorId: 2,
      appointmentDate: '2026-03-15T10:00:00',
      symptoms: 'Headache and fever',
      consultationType: 'VIDEO'
    });
    console.log('Appointment booked:', response.data);
  } catch (error) {
    console.error('Booking failed:', error);
  }
};
```

### Get Patient Appointments
```typescript
const fetchAppointments = async (patientId: number) => {
  try {
    const response = await appointmentAPI.getPatientAppointments(patientId);
    const appointments = response.data;
    setAppointments(appointments);
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
  }
};
```

### Approve Appointment (Doctor)
```typescript
const approveAppointment = async (appointmentId: number) => {
  try {
    const response = await appointmentAPI.approveAppointment(appointmentId);
    console.log('Appointment approved:', response.data);
  } catch (error) {
    console.error('Approval failed:', error);
  }
};
```

---

## 💊 Prescriptions

### Create Prescription (Doctor)
```typescript
import { prescriptionAPI } from '@/services/api';

const createPrescription = async () => {
  try {
    const response = await prescriptionAPI.create({
      patientId: 1,
      doctorId: 2,
      appointmentId: 5,
      medicineName: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'Twice daily',
      duration: '7 days',
      instructions: 'Take after meals'
    });
    console.log('Prescription created:', response.data);
  } catch (error) {
    console.error('Failed to create prescription:', error);
  }
};
```

### Get Patient Prescriptions
```typescript
const fetchPrescriptions = async (patientId: number) => {
  try {
    const response = await prescriptionAPI.getPatientPrescriptions(patientId);
    const prescriptions = response.data;
    setPrescriptions(prescriptions);
  } catch (error) {
    console.error('Failed to fetch prescriptions:', error);
  }
};
```

---

## 💊 Medicines

### Search Medicines
```typescript
import { medicineAPI } from '@/services/api';

const searchMedicines = async (query: string) => {
  try {
    const response = await medicineAPI.search(query);
    const medicines = response.data;
    setMedicines(medicines);
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

### Get All Medicines
```typescript
const fetchAllMedicines = async () => {
  try {
    const response = await medicineAPI.getAll();
    const medicines = response.data;
    setMedicines(medicines);
  } catch (error) {
    console.error('Failed to fetch medicines:', error);
  }
};
```

---

## 🏥 Pharmacies

### Get Nearby Pharmacies
```typescript
import { pharmacyAPI } from '@/services/api';

const findNearbyPharmacies = async (lat: number, lng: number) => {
  try {
    const response = await pharmacyAPI.getNearby(lat, lng);
    const pharmacies = response.data;
    setPharmacies(pharmacies);
  } catch (error) {
    console.error('Failed to find pharmacies:', error);
  }
};
```

---

## 📞 Video Calls

### Initiate Call
```typescript
import { callAPI } from '@/services/api';

const startCall = async () => {
  try {
    const response = await callAPI.initiate({
      patientId: 1,
      doctorId: 2,
      appointmentId: 5
    });
    const callData = response.data;
    // Join WebRTC room
  } catch (error) {
    console.error('Failed to initiate call:', error);
  }
};
```

### Doctor Goes Online
```typescript
const goOnline = async (doctorId: number) => {
  try {
    await callAPI.doctorOnline(doctorId);
    console.log('Doctor is now online');
  } catch (error) {
    console.error('Failed to go online:', error);
  }
};
```

### Get Available Doctors
```typescript
const fetchAvailableDoctors = async () => {
  try {
    const response = await callAPI.getAvailableDoctors();
    const doctors = response.data;
    setAvailableDoctors(doctors);
  } catch (error) {
    console.error('Failed to fetch available doctors:', error);
  }
};
```

---

## 🔌 WebSocket Real-time Features

### Connect to Socket
```typescript
import socketService from '@/services/socket';
import { useEffect } from 'react';

const MyComponent = () => {
  useEffect(() => {
    const socket = socketService.connect();
    
    // Listen for events
    socket.on('doctor_online', (data) => {
      console.log('Doctor came online:', data);
    });
    
    socket.on('consultation_request', (data) => {
      console.log('New consultation request:', data);
    });
    
    socket.on('prescription_added', (data) => {
      console.log('New prescription:', data);
    });
    
    // Cleanup
    return () => {
      socketService.disconnect();
    };
  }, []);
  
  return <div>My Component</div>;
};
```

### Emit Events
```typescript
import socketService from '@/services/socket';

// Doctor goes online
socketService.emit('doctor_online', {
  doctorId: 2,
  name: 'Dr. Sharma',
  specialization: 'Cardiology'
});

// Request consultation
socketService.emit('consultation_request', {
  patientId: 1,
  doctorId: 2,
  appointmentId: 5
});

// Accept consultation
socketService.emit('consultation_accepted', {
  consultationId: 10,
  doctorId: 2
});
```

---

## 🎥 WebRTC Video Call

### Join Room
```typescript
import socketService from '@/services/socket';

const joinVideoCall = (roomId: string, userId: string) => {
  socketService.emit('join-room', { roomId, userId });
};
```

### WebRTC Signaling
```typescript
// Send offer
socketService.emit('offer', {
  roomId: 'room123',
  offer: peerConnection.localDescription
});

// Send answer
socketService.emit('answer', {
  roomId: 'room123',
  answer: peerConnection.localDescription
});

// Send ICE candidate
socketService.emit('ice-candidate', {
  roomId: 'room123',
  candidate: event.candidate
});

// Listen for events
socket.on('offer', async (data) => {
  await peerConnection.setRemoteDescription(data.offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socketService.emit('answer', { roomId: data.roomId, answer });
});

socket.on('answer', async (data) => {
  await peerConnection.setRemoteDescription(data.answer);
});

socket.on('ice-candidate', async (data) => {
  await peerConnection.addIceCandidate(data.candidate);
});
```

---

## 🛠️ Error Handling

### Global Error Handler
```typescript
import api from '@/services/api';

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    } else if (error.response?.status === 500) {
      // Show error toast
      console.error('Server error:', error);
    }
    return Promise.reject(error);
  }
);
```

### Try-Catch Pattern
```typescript
const fetchData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await appointmentAPI.getDoctors();
    setDoctors(response.data);
  } catch (error: any) {
    setError(error.response?.data?.message || 'Failed to fetch doctors');
  } finally {
    setLoading(false);
  }
};
```

---

## 📱 React Hooks Pattern

### Custom Hook for API Calls
```typescript
import { useState, useEffect } from 'react';
import { appointmentAPI } from '@/services/api';

const useAppointments = (patientId: number) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentAPI.getPatientAppointments(patientId);
        setAppointments(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [patientId]);
  
  return { appointments, loading, error };
};

// Usage in component
const MyComponent = () => {
  const { appointments, loading, error } = useAppointments(1);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render appointments */}</div>;
};
```

---

## 🔄 React Query Pattern (Recommended)

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { appointmentAPI } from '@/services/api';

// Fetch data
const useAppointments = (patientId: number) => {
  return useQuery({
    queryKey: ['appointments', patientId],
    queryFn: () => appointmentAPI.getPatientAppointments(patientId),
  });
};

// Mutate data
const useBookAppointment = () => {
  return useMutation({
    mutationFn: (data) => appointmentAPI.bookAppointment(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};

// Usage
const MyComponent = () => {
  const { data, isLoading, error } = useAppointments(1);
  const bookMutation = useBookAppointment();
  
  const handleBook = () => {
    bookMutation.mutate({
      patientId: 1,
      doctorId: 2,
      appointmentDate: '2026-03-15T10:00:00',
      symptoms: 'Fever',
      consultationType: 'VIDEO'
    });
  };
  
  return <div>{/* Component JSX */}</div>;
};
```

---

## 🎯 Quick Tips

1. **Always handle errors** - Use try-catch or React Query error handling
2. **Show loading states** - Improve UX with loading indicators
3. **Use TypeScript** - Define interfaces for API responses
4. **Invalidate queries** - Refresh data after mutations
5. **Clean up sockets** - Always disconnect in useEffect cleanup
6. **Use environment variables** - Never hardcode URLs
7. **Add request interceptors** - For authentication tokens
8. **Implement retry logic** - For failed requests
9. **Cache responses** - Use React Query for automatic caching
10. **Monitor network** - Use browser DevTools Network tab

---

## 📚 Resources

- API Service: `src/services/api.ts`
- Socket Service: `src/services/socket.ts`
- Auth Context: `src/contexts/AuthContext.tsx`
- Environment: `.env`
- Full Guide: `CONNECTION_GUIDE.md`
