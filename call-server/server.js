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

const rooms = new Map();
const onlineDoctors = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('doctor_online', (data) => {
    onlineDoctors.set(data.doctorId, { ...data, socketId: socket.id });
    io.emit('doctor_online', data);
    console.log('Doctor online:', data.doctorId);
  });

  socket.on('doctor_offline', (data) => {
    onlineDoctors.delete(data.doctorId);
    io.emit('doctor_offline', data);
    console.log('Doctor offline:', data.doctorId);
  });

  socket.on('consultation_request', (data) => {
    const doctor = onlineDoctors.get(data.doctorId);
    if (doctor) {
      io.to(doctor.socketId).emit('consultation_request', data);
      console.log('Consultation request sent to doctor:', data.doctorId);
    }
  });

  socket.on('consultation_accepted', (data) => {
    io.emit('consultation_accepted', data);
    console.log('Consultation accepted:', data.consultationId);
  });

  socket.on('consultation_rejected', (data) => {
    io.emit('consultation_rejected', data);
    console.log('Consultation rejected:', data.consultationId);
  });

  socket.on('prescription_added', (data) => {
    io.emit('prescription_added', data);
    console.log('Prescription added:', data.prescriptionId);
  });

  socket.on('join-room', (data) => {
    socket.join(data.roomId);
    socket.to(data.roomId).emit('user-joined', { userId: data.userId });
    console.log(`User ${data.userId} joined room ${data.roomId}`);
  });

  socket.on('offer', (data) => {
    socket.to(data.roomId).emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.to(data.roomId).emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.roomId).emit('ice-candidate', data);
  });

  socket.on('end-call', (data) => {
    socket.to(data.roomId).emit('end-call', data);
    socket.leave(data.roomId);
  });

  socket.on('disconnect', () => {
    for (const [doctorId, doctor] of onlineDoctors.entries()) {
      if (doctor.socketId === socket.id) {
        onlineDoctors.delete(doctorId);
        io.emit('doctor_offline', { doctorId });
        break;
      }
    }
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', onlineDoctors: onlineDoctors.size });
});

const PORT = 5002;
httpServer.listen(PORT, () => {
  console.log(`Call server running on port ${PORT}`);
});
