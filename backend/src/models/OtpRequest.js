const mongoose = require("mongoose");

const otpRequestSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OtpRequest", otpRequestSchema);
