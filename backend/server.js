const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const studentRoutes = require('./src/routes/studentRoutes');
const cronRoutes = require('./src/routes/cronRouter'); 
const { startCronJob } = require('./src/utils/cronManager');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/students',studentRoutes);
app.use('/api/cron', cronRoutes);

connectDB().then(async () => {
  startCronJob();
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});

