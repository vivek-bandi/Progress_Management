const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const app = express();

connectDB();

app.use(express.json());
app.use('api/students',require('./src/routes/studentRoutes'));
app.use('api/cron',require('./src/routes/cronRouter')); 

app.listen(3000);


