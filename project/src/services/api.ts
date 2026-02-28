import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: any) =>
    api.post('/auth/register', userData),
  getCurrentUser: (id: number) =>
    api.get(`/auth/current-user/${id}`),
};

// Appointment APIs
export const appointmentAPI = {
  getDoctors: () => api.get('/appointments/doctors'),
  bookAppointment: (data: any) => api.post('/appointments/book', data),
  getPatientAppointments: (patientId: number) =>
    api.get(`/appointments/patient/${patientId}`),
  getDoctorAppointments: (doctorId: number) =>
    api.get(`/appointments/doctor/${doctorId}`),
  approveAppointment: (id: number) =>
    api.put(`/appointments/${id}/approve`),
  cancelAppointment: (id: number) =>
    api.put(`/appointments/${id}/cancel`),
};

// Prescription APIs
export const prescriptionAPI = {
  create: (data: any) => api.post('/prescriptions/create', data),
  getPatientPrescriptions: (patientId: number) =>
    api.get(`/prescriptions/patient/${patientId}`),
  getDoctorPrescriptions: (doctorId: number) =>
    api.get(`/prescriptions/doctor/${doctorId}`),
  updateStatus: (id: number, status: string) =>
    api.put(`/prescriptions/${id}/status`, { status }),
};

// Medicine APIs
export const medicineAPI = {
  search: (query: string) =>
    api.get(`/medicines/search?q=${query}`),
  getAll: () => api.get('/medicines'),
  create: (data: any) => api.post('/medicines/create', data),
  update: (id: number, data: any) =>
    api.put(`/medicines/${id}`, data),
};

// Pharmacy APIs
export const pharmacyAPI = {
  getAll: () => api.get('/pharmacies'),
  getNearby: (lat: number, lng: number) =>
    api.get(`/pharmacies/nearby?lat=${lat}&lng=${lng}`),
};

// Call APIs
export const callAPI = {
  initiate: (data: any) => api.post('/calls/initiate', data),
  doctorOnline: (doctorId: number) =>
    api.post('/calls/doctor/online', { doctorId }),
  doctorOffline: (doctorId: number) =>
    api.post('/calls/doctor/offline', { doctorId }),
  getAvailableDoctors: () => api.get('/calls/doctors/available'),
};

// Health Record APIs
export const healthRecordAPI = {
  getPatientRecords: (patientId: number) =>
    api.get(`/health-records/patient/${patientId}`),
  create: (data: any) => api.post('/health-records', data),
};

export default api;
