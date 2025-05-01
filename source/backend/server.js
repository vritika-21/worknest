require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const hrRoutes = require('./routes/hrRoutes');

const app = express();

// app.use(cors({
//   origin: true, // Allows all origins (temporary)
//   credentials: true
// }));
// app.options('*', cors());

app.use(cors({
  origin: 'http://localhost:3000', // Explicit frontend URL
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

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));