require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

async function main(){
  try{
    const OtpRequest = require('../src/models/OtpRequest');
    const uri = process.env.MONGO_URI;
    const identifier = process.argv[2] || 'testuser1';
    if(!uri){
      console.error('MONGO_URI not set in .env');
      process.exit(1);
    }
    await mongoose.connect(uri);
    const rec = await OtpRequest.findOne({ identifier }).lean();
    if(!rec){
      console.log(`No OTP record found for ${identifier}`);
    } else {
      console.log(`OTP for ${identifier}:`, rec.otp);
      console.log('OTP record:', JSON.stringify(rec, null, 2));
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch(err){
    console.error('ERROR', err);
    process.exit(2);
  }
}

main();
