require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const hrRoutes = require('./routes/hrRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();


const allowedOrigins = [
  'http://localhost:3000',
  'https://frontend-worknest.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Database Connected!'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/attendance', attendanceRoutes);


app.listen(process.env.PORT, '0.0.0.0', () => console.log(`Server running on port ${process.env.PORT}`));