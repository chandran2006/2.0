import { User, Doctor, Appointment, Prescription, Medicine, Reminder } from '@/types';

export const mockUsers: Record<string, User> = {
  'patient1@teleasha.com': {
    id: 'p1', email: 'patient1@teleasha.com', name: 'Ramesh Kumar', role: 'PATIENT',
    phone: '+91 98765 43210', address: 'Mumbai, India', createdAt: '2025-01-15',
  },
  'dr.sharma@teleasha.com': {
    id: 'd1', email: 'dr.sharma@teleasha.com', name: 'Dr. Priya Sharma', role: 'DOCTOR',
    phone: '+91 98765 11111', specialization: 'Cardiologist', createdAt: '2024-06-01',
  },
  'pharmacy@teleasha.com': {
    id: 'ph1', email: 'pharmacy@teleasha.com', name: 'MedPlus Pharmacy', role: 'PHARMACY',
    pharmacyName: 'MedPlus Healthcare', phone: '+91 98765 22222', createdAt: '2024-08-01',
  },
  'admin@teleasha.com': {
    id: 'a1', email: 'admin@teleasha.com', name: 'Admin User', role: 'ADMIN',
    phone: '+91 98765 00000', createdAt: '2024-01-01',
  },
};

export const mockPasswords: Record<string, string> = {
  'patient1@teleasha.com': 'password123',
  'dr.sharma@teleasha.com': 'password123',
  'pharmacy@teleasha.com': 'pharmacy123',
  'admin@teleasha.com': 'admin123',
};

export const mockDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Priya Sharma', specialization: 'Cardiologist', rating: 4.8, experience: 12, isOnline: true, consultationFee: 500 },
  { id: 'd2', name: 'Dr. Arun Patel', specialization: 'Dermatologist', rating: 4.6, experience: 8, isOnline: true, consultationFee: 400 },
  { id: 'd3', name: 'Dr. Meena Gupta', specialization: 'Pediatrician', rating: 4.9, experience: 15, isOnline: false, consultationFee: 450 },
  { id: 'd4', name: 'Dr. Vikram Singh', specialization: 'Neurologist', rating: 4.7, experience: 10, isOnline: true, consultationFee: 600 },
  { id: 'd5', name: 'Dr. Anjali Mehta', specialization: 'General Physician', rating: 4.5, experience: 6, isOnline: false, consultationFee: 300 },
];

export const mockAppointments: Appointment[] = [
  { id: 'a1', patientId: 'p1', patientName: 'Ramesh Kumar', doctorId: 'd1', doctorName: 'Dr. Priya Sharma', doctorSpecialization: 'Cardiologist', appointmentDate: '2026-02-28T14:00:00', status: 'APPROVED', symptoms: 'Chest pain, shortness of breath', consultationType: 'VIDEO' },
  { id: 'a2', patientId: 'p1', patientName: 'Ramesh Kumar', doctorId: 'd2', doctorName: 'Dr. Arun Patel', doctorSpecialization: 'Dermatologist', appointmentDate: '2026-03-02T10:00:00', status: 'PENDING', symptoms: 'Skin rash', consultationType: 'VIDEO' },
  { id: 'a3', patientId: 'p2', patientName: 'Sunita Devi', doctorId: 'd1', doctorName: 'Dr. Priya Sharma', doctorSpecialization: 'Cardiologist', appointmentDate: '2026-02-28T16:00:00', status: 'PENDING', symptoms: 'Irregular heartbeat', consultationType: 'AUDIO' },
];

export const mockPrescriptions: Prescription[] = [
  { id: 'rx1', patientId: 'p1', patientName: 'Ramesh Kumar', doctorId: 'd1', doctorName: 'Dr. Priya Sharma', medicineName: 'Aspirin 500mg', dosage: '1 tablet twice daily', duration: '14 days', instructions: 'Take after meals', status: 'ACTIVE', createdAt: '2026-02-20' },
  { id: 'rx2', patientId: 'p1', patientName: 'Ramesh Kumar', doctorId: 'd1', doctorName: 'Dr. Priya Sharma', medicineName: 'Metoprolol 25mg', dosage: '1 tablet once daily', duration: '30 days', instructions: 'Take in the morning', status: 'ACTIVE', createdAt: '2026-02-20' },
];

export const mockMedicines: Medicine[] = [
  { id: 'm1', name: 'Aspirin', genericName: 'Acetylsalicylic acid', manufacturer: 'Bayer', dosageForm: 'Tablet', dosageStrength: '500mg', price: 12.5, available: true, sideEffects: 'Stomach irritation, nausea', description: 'Pain reliever and anti-inflammatory' },
  { id: 'm2', name: 'Metoprolol', genericName: 'Metoprolol tartrate', manufacturer: 'Cipla', dosageForm: 'Tablet', dosageStrength: '25mg', price: 35.0, available: true, sideEffects: 'Dizziness, fatigue', description: 'Beta-blocker for heart conditions' },
  { id: 'm3', name: 'Amoxicillin', genericName: 'Amoxicillin trihydrate', manufacturer: 'Sun Pharma', dosageForm: 'Capsule', dosageStrength: '250mg', price: 28.0, available: true, sideEffects: 'Rash, diarrhea', description: 'Antibiotic for bacterial infections' },
  { id: 'm4', name: 'Paracetamol', genericName: 'Acetaminophen', manufacturer: 'GSK', dosageForm: 'Tablet', dosageStrength: '500mg', price: 8.0, available: true, sideEffects: 'Rare allergic reactions', description: 'Pain and fever relief' },
];

export const mockReminders: Reminder[] = [
  { id: 'r1', type: 'medicine', title: 'Aspirin 500mg', time: '10:00 AM', description: '1 tablet after breakfast' },
  { id: 'r2', type: 'appointment', title: 'Dr. Priya Sharma', time: '2:00 PM', description: 'Video consultation - Cardiology' },
  { id: 'r3', type: 'checkup', title: 'Routine Checkup', time: 'Tomorrow', description: 'Annual health screening' },
];
