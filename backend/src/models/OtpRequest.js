const mongoose =
  require("mongoose");


// ==========================================
// OTP REQUEST SCHEMA
// ==========================================
const otpRequestSchema =
  new mongoose.Schema(

    {

      // ====================================
      // USER IDENTIFIER
      // ====================================
      identifier: {

        type: String,

        required: true,

        unique: true,

        trim: true,

        index: true,

      },


      // ====================================
      // OTP
      // ====================================
      otp: {

        type: String,

        required: true,

        minlength: 6,

        maxlength: 6,

      },


      // ====================================
      // OTP EXPIRY
      // ====================================
      expiresAt: {

        type: Date,

        required: true,

      },


      // ====================================
      // ATTEMPTS
      // ====================================
      attempts: {

        type: Number,

        default: 0,

        min: 0,

        max: 5,

      },


      // ====================================
      // RESEND COUNT
      // ====================================
      resendCount: {

        type: Number,

        default: 0,

      },


      // ====================================
      // DEVICE INFO (OPTIONAL)
      // ====================================
      ipAddress: {

        type: String,

        default: "",

      },

      userAgent: {

        type: String,

        default: "",

      },

    },

    {

      timestamps: true,

    }

  );


// ==========================================
// AUTO DELETE EXPIRED OTP
// ==========================================
otpRequestSchema.index(

  {

    expiresAt: 1,

  },

  {

    expireAfterSeconds: 0,

  }

);


// ==========================================
// MODEL
// ==========================================
const OtpRequest =
  mongoose.model(

    "OtpRequest",

    otpRequestSchema

  );


// ==========================================
// EXPORT
// ==========================================
module.exports =
  OtpRequest;