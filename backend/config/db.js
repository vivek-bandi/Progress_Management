const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async() =>{
  try{
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected');
  }catch(err){
  console.error('Connection error : ',err.message);
  }
}

module.exports = connectDB;