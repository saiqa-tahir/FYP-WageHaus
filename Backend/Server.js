require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const ChatMessage = require('./models/ChatMessage');
const axios = require('axios');
const router = express.Router();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Import routes
const authRoutes = require('./routes/SeekerAuthRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const jobPostRoutes = require('./routes/jobPostRoutes');
const reportRoutes = require('./routes/reportRoutes');
const recruiterReportRoutes = require('./routes/recruiterReportRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const communityRoutes = require('./routes/communityRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', reportRoutes);
app.use('/api/recruiter', recruiterReportRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobPostRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/applications', applicationRoutes);

// WebSocket Chat Functionality
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinGroup', async (groupId) => {
    socket.join(groupId);
    console.log(`User ${socket.id} joined group ${groupId}`);
    try {
      const messages = await ChatMessage.find({ groupId }).sort({ timestamp: 1 });
      socket.emit('previousMessages', messages);
    } catch (error) {
      console.error('Error fetching previous messages:', error);
    }
  });

  socket.on('sendMessage', async ({ groupId, userEmail, message }) => {
    const chatMessage = new ChatMessage({ groupId, userEmail, message });
    try {
      await chatMessage.save();
      io.to(groupId).emit('receiveMessage', chatMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Prediction Route
router.post('/predict', async (req, res) => {
  const { field, text } = req.body;
  try {
    const response = await axios.post('http://localhost:8000/predict', { field, text });
    res.json({ suggestion: response.data.suggestion });
  } catch (error) {
    console.error('Error predicting next word:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

app.use('/api', router);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});