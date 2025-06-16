const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const studentRoutes = require('./src/routes/studentRoutes');
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/students',studentRoutes);
// app.use('api/cron',require('./src/routes/cronRouter')); 
app.listen(3000);


