const User =
  require("../models/User");

const OtpRequest =
  require("../models/OtpRequest");

const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

const nodemailer =
  require("nodemailer");


// =========================================
// GENERATE JWT TOKEN
// =========================================
const generateToken =
  (id) => {

    return jwt.sign(

      { id },

      process.env.JWT_SECRET,

      {

        expiresIn:
          process.env.JWT_EXPIRE || "7d",

      }

    );

  };


// =========================================
// EMAIL TRANSPORTER
// =========================================
const getTransporter =
  () => {

    try {

      if (

        process.env.EMAIL_HOST &&

        process.env.EMAIL_USER &&

        process.env.EMAIL_PASS

      ) {

        return nodemailer.createTransport({

          host:
            process.env.EMAIL_HOST,

          port:
            Number(
              process.env.EMAIL_PORT
            ) || 587,

          secure:

            process.env.EMAIL_SECURE ===
            "true",

          auth: {

            user:
              process.env.EMAIL_USER,

            pass:
              process.env.EMAIL_PASS,

          },

        });

      }

      return null;

    }

    catch (error) {

      console.log(
        "TRANSPORT ERROR:",
        error
      );

      return null;

    }

  };


// =========================================
// SEND EMAIL
// =========================================
const sendEmail =
  async (

    to,
    subject,
    text

  ) => {

    try {

      const transporter =
        getTransporter();

      if (!transporter) {

        console.log(

          "⚠️ Email service not configured"

        );

        return false;

      }

      await transporter.sendMail({

        from:

          process.env.EMAIL_FROM ||

          process.env.EMAIL_USER,

        to,

        subject,

        text,

      });

      return true;

    }

    catch (error) {

      console.log(
        "EMAIL ERROR:",
        error
      );

      return false;

    }

  };


// =========================================
// HELPERS
// =========================================
const maskEmail =
  (email) => {

    if (!email) return "";

    const [
      local,
      domain
    ] = email.split("@");

    return `${local.slice(0, 2)}*****@${domain}`;

  };


const maskPhone =
  (phone) => {

    if (!phone) return "";

    const cleaned =
      phone.toString().trim();

    if (cleaned.length < 4) {
      return "****";
    }

    return `${cleaned.slice(0, 2)}******${cleaned.slice(-2)}`;

  };


const generateOtp =
  () => {

    return Math.floor(

      100000 +

      Math.random() * 900000

    ).toString();

  };


// =========================================
// PASSWORD STRENGTH
// =========================================
const isStrongPassword =
  (password) => {

    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

      .test(password);

  };


// =========================================
// ACCOUNT LOCK CHECK
// =========================================
const isAccountLocked =
  (user) => {

    return (

      user.lockUntil &&

      user.lockUntil > Date.now()

    );

  };


// =========================================
// SAVE OTP
// =========================================
const saveOtpRequest =
  async (

    identifier,
    otp

  ) => {

    return await OtpRequest.findOneAndUpdate(

      {

        identifier:
          identifier.toLowerCase(),

      },

      {

        otp,

        attempts: 0,

        resendCount: 0,

        lastSentAt:
          new Date(),

        expiresAt:

          new Date(

            Date.now() +

            15 * 60 * 1000

          ),

      },

      {

        upsert: true,

        new: true,

      }

    );

  };


// =========================================
// VALIDATE OTP
// =========================================
const validateOtpRequest =
  async (

    identifier,
    otp

  ) => {

    const record =
      await OtpRequest.findOne({

        identifier:
          identifier.toLowerCase(),

      });


    if (!record) {

      return {

        valid: false,

        reason:
          "OTP not found",

      };

    }


    if (

      record.expiresAt <
      new Date()

    ) {

      return {

        valid: false,

        reason:
          "OTP expired",

      };

    }


    if (
      record.attempts >= 3
    ) {

      return {

        valid: false,

        reason:
          "OTP attempt limit reached",

      };

    }


    if (
      record.otp !== otp
    ) {

      record.attempts += 1;

      await record.save({

        validateBeforeSave:
          false,

      });

      return {

        valid: false,

        reason:
          "Invalid OTP",

      };

    }


    return {

      valid: true,

      record,

    };

  };


// =========================================
// REGISTER USER
// =========================================
const registerUser =
  async (req, res) => {

    try {

      const {

        identifier,
        name,
        email,
        password,
        role,

      } = req.body;


      const cleanIdentifier =
        identifier?.trim().toLowerCase();

      const cleanEmail =
        email?.trim().toLowerCase();

      const cleanName =
        name?.trim();


      if (

        !cleanIdentifier ||
        !cleanName ||
        !cleanEmail ||
        !password ||
        !role

      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required",

        });

      }


      const existingUser =
        await User.findOne({

          $or: [

            {
              email:
                cleanEmail,
            },

            {
              identifier:
                cleanIdentifier,
            },

          ],

        });


      if (existingUser) {

        return res.status(400).json({

          success: false,

          message:
            "User already exists",

        });

      }


      const salt =
        await bcrypt.genSalt(10);

      const hashedPassword =
        await bcrypt.hash(

          password,

          salt

        );


      const user =
        await User.create({

          identifier:
            cleanIdentifier,

          name:
            cleanName,

          email:
            cleanEmail,

          password:
            hashedPassword,

          role,

          profileImage: "",

          isOnline:
            false,

          isActive:
            true,

          loginAttempts:
            0,

          lockUntil:
            null,

          isFirstLogin:
            true,

          trustScore: 0,

        });


      const token =
        generateToken(
          user._id
        );


      return res.status(201).json({

        success: true,

        message:
          "Registration successful",

        token,

        user: {
          _id: user._id,
          identifier: user.identifier,
          name: user.name,
          email: user.email,
          role: user.role,
          isFirstLogin: user.isFirstLogin,
          isActive: user.isActive,
        },

      });

    }

    catch (error) {

      console.log(
        "REGISTER ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// =========================================
// LOGIN USER
// =========================================
const loginUser =
  async (req, res) => {

    try {

      const {

        identifier,
        password,
        role,

      } = req.body;


      if (

        !identifier ||
        !password

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Identifier and password are required",

        });

      }


      const cleanIdentifier =
        identifier
          .trim()
          .toLowerCase();


      const user =
        await User.findOne({

          $or: [

            {
              email:
                cleanIdentifier,
            },

            {
              identifier:
                cleanIdentifier,
            },

          ],

        }).select("+password");


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      if (
        role &&
        user.role !== role
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Role does not match",

        });

      }


      if (
        isAccountLocked(user)
      ) {

        return res.status(423).json({

          success: false,

          message:
            "Account temporarily locked",

        });

      }


      const isMatch =
        await bcrypt.compare(

          password,

          user.password

        );


      if (!isMatch) {

        user.loginAttempts =
          (user.loginAttempts || 0) + 1;


        if (
          user.loginAttempts >= 5
        ) {

          user.lockUntil =
            Date.now() +
            15 * 60 * 1000;

        }


        await user.save({

          validateBeforeSave:
            false,

        });


        return res.status(401).json({

          success: false,

          message:
            "Invalid credentials",

        });

      }


      user.loginAttempts = 0;

      user.lockUntil = null;

      user.isOnline = true;

      await user.save({

        validateBeforeSave:
          false,

      });


      const token =
        generateToken(
          user._id
        );


      return res.status(200).json({

        success: true,

        token,

        user: {
          _id: user._id,
          identifier: user.identifier,
          name: user.name,
          email: user.email,
          role: user.role,
          isFirstLogin: user.isFirstLogin,
          isActive: user.isActive,
        },

      });

    }

    catch (error) {

      console.log(
        "LOGIN ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };
  //
// =========================================
// LOGOUT USER
// =========================================
const logoutUser =
  async (req, res) => {

    try {

      if (req.user?._id) {

        await User.findByIdAndUpdate(

          req.user._id,

          {

            isOnline: false,

            lastActive:
              new Date(),

          }

        );

      }


      return res.status(200).json({

        success: true,

        message:
          "Logged out successfully",

      });

    }

    catch (error) {

      console.log(
        "LOGOUT ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// =========================================
// CHANGE PASSWORD
// =========================================
const changePassword =
  async (req, res) => {

    try {

      const {

        oldPassword,
        newPassword,

      } = req.body;


      if (

        !oldPassword ||
        !newPassword

      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required",

        });

      }


      const user =
        await User.findById(
          req.user._id
        ).select("+password");


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      const isMatch =
        await bcrypt.compare(

          oldPassword,
          user.password

        );


      if (!isMatch) {

        return res.status(400).json({

          success: false,

          message:
            "Old password incorrect",

        });

      }


      const salt =
        await bcrypt.genSalt(10);

      user.password =
        await bcrypt.hash(

          newPassword,
          salt

        );


      user.isFirstLogin =
        false;

      user.passwordChangedAt =
        new Date();


      await user.save({

        validateBeforeSave:
          false,

      });


      return res.status(200).json({

        success: true,

        message:
          "Password changed successfully",

      });

    }

    catch (error) {

      console.log(
        "CHANGE PASSWORD ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// =========================================
// FORGOT PASSWORD
// =========================================
const forgotPassword =
  async (req, res) => {

    try {

      const {
        identifier
      } = req.body;


      const cleanIdentifier =
        identifier
          ?.trim()
          .toLowerCase();


      if (!cleanIdentifier) {

        return res.status(400).json({

          success: false,

          message:
            "Identifier is required",

        });

      }


      const user =
        await User.findOne({

          identifier:
            cleanIdentifier,

        });


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      const otp =
        generateOtp();


      await saveOtpRequest(

        cleanIdentifier,
        otp

      );


      if (user.email) {

        await sendEmail(

          user.email,

          "Your AlumniConnect OTP",

          `Your OTP is ${otp}. It expires in 15 minutes.`

        );

      }


      return res.status(200).json({

        success: true,

        message:
          "OTP sent successfully",

        email:
          maskEmail(
            user.email
          ),

        phone:
          maskPhone(
            user.phone
          ),

      });

    }

    catch (error) {

      console.log(
        "FORGOT PASSWORD ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// =========================================
// RESEND OTP
// =========================================
const resendOtp =
  async (req, res) => {

    try {

      const {
        identifier
      } = req.body;


      const cleanIdentifier =
        identifier
          ?.trim()
          .toLowerCase();


      const user =
        await User.findOne({

          identifier:
            cleanIdentifier,

        });


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      const otp =
        generateOtp();


      await saveOtpRequest(

        cleanIdentifier,
        otp

      );


      if (user.email) {

        await sendEmail(

          user.email,

          "Your AlumniConnect OTP",

          `Your OTP is ${otp}. It expires in 15 minutes.`

        );

      }


      return res.status(200).json({

        success: true,

        message:
          "OTP resent successfully",

        email:
          maskEmail(
            user.email
          ),

        phone:
          maskPhone(
            user.phone
          ),

      });

    }

    catch (error) {

      console.log(
        "RESEND OTP ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// =========================================
// VERIFY OTP
// =========================================
const verifyOtp =
  async (req, res) => {

    try {

      const {

        identifier,
        otp,

      } = req.body;


      const result =
        await validateOtpRequest(

          identifier,
          otp

        );


      if (!result.valid) {

        return res.status(400).json({

          success: false,

          message:
            result.reason,

        });

      }


      return res.status(200).json({

        success: true,

        message:
          "OTP verified successfully",

      });

    }

    catch (error) {

      console.log(
        "VERIFY OTP ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// =========================================
// RESET PASSWORD
// =========================================
const resetPassword =
  async (req, res) => {

    try {

      const {

        identifier,
        otp,
        password,

      } = req.body;


      const result =
        await validateOtpRequest(

          identifier,
          otp

        );


      if (!result.valid) {

        return res.status(400).json({

          success: false,

          message:
            result.reason,

        });

      }


      const user =
        await User.findOne({

          identifier:
            identifier.toLowerCase(),

        }).select("+password");


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      const salt =
        await bcrypt.genSalt(10);

      user.password =
        await bcrypt.hash(

          password,
          salt

        );


      user.isFirstLogin =
        false;

      user.passwordChangedAt =
        new Date();

      user.loginAttempts =
        0;

      user.lockUntil =
        null;


      await user.save({

        validateBeforeSave:
          false,

      });


      await OtpRequest.deleteOne({

        identifier:
          identifier.toLowerCase(),

      });


      return res.status(200).json({

        success: true,

        message:
          "Password reset successfully",

      });

    }

    catch (error) {

      console.log(
        "RESET PASSWORD ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// =========================================
// GET CURRENT USER
// =========================================
const getMe =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        ).select("-password");


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      return res.status(200).json({

        success: true,

        user,

      });

    }

    catch (error) {

      console.log(
        "GET ME ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// =========================================
// EXPORTS
// =========================================
module.exports = {

  registerUser,

  loginUser,

  logoutUser,

  changePassword,

  forgotPassword,

  resendOtp,

  verifyOtp,

  resetPassword,

  getMe,

};