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

        lowercase: true,

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
      // OTP ATTEMPTS
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

        min: 0,

      },


      // ====================================
      // LAST SENT TIME
      // ====================================
      lastSentAt: {

        type: Date,

        default: Date.now,

      },


      // ====================================
      // DEVICE INFO
      // ====================================
      ipAddress: {

        type: String,

        default: "",

        trim: true,

      },

      userAgent: {

        type: String,

        default: "",

        trim: true,

      },


      // ====================================
      // OTP STATUS
      // ====================================
      isVerified: {

        type: Boolean,

        default: false,

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
// IDENTIFIER + OTP INDEX
// ==========================================
otpRequestSchema.index({

  identifier: 1,

  otp: 1,

});


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