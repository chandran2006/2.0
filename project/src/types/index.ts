export type UserRole = 'PATIENT' | 'DOCTOR' | 'PHARMACY' | 'ADMIN';

export type AppointmentStatus = 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
export type ConsultationType = 'VIDEO' | 'AUDIO' | 'IN_PERSON';
export type PrescriptionStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  specialization?: string;
  licenseNumber?: string;
  pharmacyName?: string;
  avatar?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string;
  status: AppointmentStatus;
  symptoms: string;
  notes?: string;
  consultationType: ConsultationType;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  medicineName: string;
  dosage: string;
  duration: string;
  instructions: string;
  status: PrescriptionStatus;
  createdAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  dosageForm: string;
  dosageStrength: string;
  price: number;
  available: boolean;
  sideEffects: string;
  description: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  avatar?: string;
  rating: number;
  experience: number;
  isOnline: boolean;
  consultationFee: number;
}

export interface HealthMetric {
  label: string;
  value: string;
  unit: string;
  icon: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface Reminder {
  id: string;
  type: 'medicine' | 'appointment' | 'checkup';
  title: string;
  time: string;
  description: string;
}
