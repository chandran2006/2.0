import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store active connections
const rooms = new Map();
const onlineDoctors = new Map(); // doctorId -> { doctorId, name, specialization, socketId, timestamp }
const onlinePatients = new Map(); // patientId -> { patientId, name, socketId, timestamp }
const activeConsultations = new Map(); // consultationId -> { patientId, doctorId, roomId, startTime }

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  // Doctor goes online
  socket.on('doctor_online', (data) => {
    const doctorInfo = {
      doctorId: data.doctorId,
      name: data.name,
      specialization: data.specialization,
      socketId: socket.id,
      timestamp: Date.now()
    };
    onlineDoctors.set(data.doctorId, doctorInfo);
    
    // Broadcast to all clients that doctor is online
    io.emit('doctor_status_changed', {
      doctorId: data.doctorId,
      isOnline: true,
      name: data.name,
      specialization: data.specialization
    });
    
    // Send list of online doctors to the newly connected doctor
    socket.emit('online_doctors_list', Array.from(onlineDoctors.values()));
    
    console.log(`👨‍⚕️ Doctor online: ${data.name} (ID: ${data.doctorId})`);
    console.log(`📊 Total online doctors: ${onlineDoctors.size}`);
  });

  // Doctor goes offline
  socket.on('doctor_offline', (data) => {
    onlineDoctors.delete(data.doctorId);
    
    // Broadcast to all clients that doctor is offline
    io.emit('doctor_status_changed', {
      doctorId: data.doctorId,
      isOnline: false
    });
    
    console.log(`👨‍⚕️ Doctor offline: ${data.doctorId}`);
    console.log(`📊 Total online doctors: ${onlineDoctors.size}`);
  });

  // Patient joins (optional tracking)
  socket.on('patient_online', (data) => {
    const patientInfo = {
      patientId: data.patientId,
      name: data.name,
      socketId: socket.id,
      timestamp: Date.now()
    };
    onlinePatients.set(data.patientId, patientInfo);
    
    // Send current online doctors to patient
    socket.emit('online_doctors_list', Array.from(onlineDoctors.values()));
    
    console.log(`👤 Patient online: ${data.name} (ID: ${data.patientId})`);
  });

  // Get online doctors list
  socket.on('get_online_doctors', () => {
    socket.emit('online_doctors_list', Array.from(onlineDoctors.values()));
  });

  // Consultation request from patient to doctor
  socket.on('consultation_request', (data) => {
    const doctor = onlineDoctors.get(data.doctorId);
    if (doctor) {
      io.to(doctor.socketId).emit('consultation_request', {
        consultationId: data.consultationId,
        patientId: data.patientId,
        patientName: data.patientName,
        reason: data.reason,
        timestamp: Date.now()
      });
      console.log(`📞 Consultation request: ${data.patientName} → Dr. ${doctor.name}`);
    } else {
      socket.emit('consultation_error', {
        message: 'Doctor is not available',
        doctorId: data.doctorId
      });
      console.log(`❌ Consultation request failed: Doctor ${data.doctorId} not online`);
    }
  });

  // Doctor accepts consultation
  socket.on('consultation_accepted', (data) => {
    const roomId = `consultation_${data.consultationId}`;
    activeConsultations.set(data.consultationId, {
      patientId: data.patientId,
      doctorId: data.doctorId,
      roomId: roomId,
      startTime: Date.now()
    });
    
    // Notify patient
    io.emit('consultation_accepted', {
      consultationId: data.consultationId,
      roomId: roomId,
      doctorId: data.doctorId,
      doctorName: data.doctorName
    });
    
    console.log(`✅ Consultation accepted: ${data.consultationId}`);
  });

  // Doctor rejects consultation
  socket.on('consultation_rejected', (data) => {
    io.emit('consultation_rejected', {
      consultationId: data.consultationId,
      reason: data.reason || 'Doctor is busy'
    });
    console.log(`❌ Consultation rejected: ${data.consultationId}`);
  });

  // Prescription added notification
  socket.on('prescription_added', (data) => {
    io.emit('prescription_added', {
      prescriptionId: data.prescriptionId,
      patientId: data.patientId,
      doctorId: data.doctorId,
      timestamp: Date.now()
    });
    console.log(`💊 Prescription added: ${data.prescriptionId}`);
  });

  // WebRTC Signaling - Join room
  socket.on('join-room', (data) => {
    socket.join(data.roomId);
    
    // Notify others in the room
    socket.to(data.roomId).emit('user-joined', {
      userId: data.userId,
      userName: data.userName,
      userType: data.userType // 'patient' or 'doctor'
    });
    
    console.log(`🎥 ${data.userType} ${data.userName} joined room ${data.roomId}`);
  });

  // WebRTC Offer
  socket.on('offer', (data) => {
    socket.to(data.roomId).emit('offer', {
      offer: data.offer,
      userId: data.userId
    });
    console.log(`📤 Offer sent in room ${data.roomId}`);
  });

  // WebRTC Answer
  socket.on('answer', (data) => {
    socket.to(data.roomId).emit('answer', {
      answer: data.answer,
      userId: data.userId
    });
    console.log(`📥 Answer sent in room ${data.roomId}`);
  });

  // WebRTC ICE Candidate
  socket.on('ice-candidate', (data) => {
    socket.to(data.roomId).emit('ice-candidate', {
      candidate: data.candidate,
      userId: data.userId
    });
  });

  // End call
  socket.on('end-call', (data) => {
    socket.to(data.roomId).emit('end-call', {
      userId: data.userId,
      reason: data.reason || 'Call ended'
    });
    socket.leave(data.roomId);
    
    // Remove from active consultations
    activeConsultations.delete(data.consultationId);
    
    console.log(`📴 Call ended in room ${data.roomId}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    // Remove doctor if disconnected
    for (const [doctorId, doctor] of onlineDoctors.entries()) {
      if (doctor.socketId === socket.id) {
        onlineDoctors.delete(doctorId);
        io.emit('doctor_status_changed', {
          doctorId: doctorId,
          isOnline: false
        });
        console.log(`👨‍⚕️ Doctor disconnected: ${doctor.name}`);
        break;
      }
    }
    
    // Remove patient if disconnected
    for (const [patientId, patient] of onlinePatients.entries()) {
      if (patient.socketId === socket.id) {
        onlinePatients.delete(patientId);
        console.log(`👤 Patient disconnected: ${patient.name}`);
        break;
      }
    }
    
    console.log('❌ Client disconnected:', socket.id);
  });
});

// REST API Endpoints
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    onlineDoctors: onlineDoctors.size,
    onlinePatients: onlinePatients.size,
    activeConsultations: activeConsultations.size,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/online-doctors', (req, res) => {
  res.json({
    doctors: Array.from(onlineDoctors.values()).map(d => ({
      doctorId: d.doctorId,
      name: d.name,
      specialization: d.specialization,
      onlineSince: new Date(d.timestamp).toISOString()
    }))
  });
});

app.get('/api/active-consultations', (req, res) => {
  res.json({
    consultations: Array.from(activeConsultations.values())
  });
});

const PORT = 5002;
httpServer.listen(PORT, () => {
  console.log('🚀 ========================================');
  console.log(`🏥 MeDora Call Server Started`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/health`);
  console.log(`👨‍⚕️ Online Doctors: http://localhost:${PORT}/api/online-doctors`);
  console.log('🚀 ========================================');
});
