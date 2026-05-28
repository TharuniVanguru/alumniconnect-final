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

        expiresIn: "7d",

      }

    );

  };


// =========================================
// VERIFY TOKEN
// =========================================
const verifyToken =
  (token) => {

    return jwt.verify(

      token,

      process.env.JWT_SECRET

    );

  };


// =========================================
// EMAIL TRANSPORTER
// =========================================
const getTransporter =
  () => {

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

    const transporter =
      getTransporter();

    if (!transporter) {

      console.log(

        "Email not configured:",

        text

      );

      return;

    }

    await transporter.sendMail({

      from:

        process.env.EMAIL_FROM ||

        process.env.EMAIL_USER,

      to,

      subject,

      text,

    });

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

    return `${phone.slice(0, 2)}******${phone.slice(-2)}`;

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

        identifier,

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

        identifier,

      });


    if (!record) {

      return {

        valid: false,

        reason:
          "OTP not found",

      };

    }


    // OTP EXPIRED
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


    // ATTEMPT LIMIT
    if (
      record.attempts >= 3
    ) {

      return {

        valid: false,

        reason:

          "OTP attempt limit reached",

      };

    }


    // INVALID OTP
    if (
      record.otp !== otp
    ) {

      record.attempts += 1;

      await record.save();

      return {

        valid: false,

        reason:
          "OTP invalid",

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


      // ====================================
      // VALIDATION
      // ====================================
      if (

        !identifier ||
        !name ||
        !email ||
        !password ||
        !role

      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required",

        });

      }


      // ====================================
      // EMAIL VALIDATION
      // ====================================
      const emailRegex =

        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (
        !emailRegex.test(email)
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid email format",

        });

      }


      // ====================================
      // PASSWORD VALIDATION
      // ====================================
      if (

        !isStrongPassword(
          password
        )

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Password must contain uppercase, lowercase, number and minimum 8 characters",

        });

      }


      // ====================================
      // CHECK EXISTING USER
      // ====================================
      const existingUser =
        await User.findOne({

          $or: [

            { email },

            { identifier },

          ],

        });


      if (existingUser) {

        return res.status(400).json({

          success: false,

          message:
            "User already exists",

        });

      }


      // ====================================
      // HASH PASSWORD
      // ====================================
      const salt =
        await bcrypt.genSalt(10);

      const hashedPassword =
        await bcrypt.hash(

          password,

          salt

        );


      // ====================================
      // CREATE USER
      // ====================================
      const user =
        await User.create({

          identifier,

          name,

          email,

          password:
            hashedPassword,

          role,

          avatar: "",

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

        });


      // ====================================
      // TOKEN
      // ====================================
      const token =
        generateToken(
          user._id
        );


      // ====================================
      // RESPONSE
      // ====================================
      res.status(201).json({

        success: true,

        message:
          "Registration successful",

        token,

        user: {

          _id:
            user._id,

          identifier:
            user.identifier,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          avatar:
            user.avatar || "",

          isOnline:
            user.isOnline,

          isFirstLogin:
            user.isFirstLogin,

          createdAt:
            user.createdAt,

        },

      });

    }

    catch (error) {

      console.log(

        "REGISTER ERROR:",

        error

      );

      res.status(500).json({

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


      // ====================================
      // VALIDATION
      // ====================================
      if (

        !identifier ||
        !password ||
        !role

      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required",

        });

      }


      // ====================================
      // FIND USER WITH PASSWORD
      // ====================================
      const user =
        await User.findOne({

          identifier,

        }).select("+password");


      // ====================================
      // USER NOT FOUND
      // ====================================
      if (!user) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid credentials",

        });

      }


      // ====================================
      // PASSWORD FIELD CHECK
      // ====================================
      if (!user.password) {

        return res.status(500).json({

          success: false,

          message:
            "Password missing in database",

        });

      }


      // ====================================
      // ACCOUNT LOCK CHECK
      // ====================================
      if (
        isAccountLocked(user)
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Account temporarily locked. Try again later.",

        });

      }


      // ====================================
      // ROLE CHECK
      // ====================================
      if (
        user.role !== role
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid role selected",

        });

      }


      // ====================================
      // ACCOUNT ACTIVE CHECK
      // ====================================
      if (
        user.isActive === false
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Account inactive",

        });

      }


      // ====================================
      // PASSWORD CHECK
      // ====================================
      const isMatch =
        await bcrypt.compare(

          password,

          user.password

        );


      // ====================================
      // INVALID PASSWORD
      // ====================================
      if (!isMatch) {

        user.loginAttempts =
          (user.loginAttempts || 0) + 1;


        // ==================================
        // LOCK ACCOUNT
        // ==================================
        if (
          user.loginAttempts >= 5
        ) {

          user.lockUntil =
            Date.now() +

            30 * 60 * 1000;

        }

        await user.save();

        return res.status(400).json({

          success: false,

          message:
            "Invalid credentials",

        });

      }


      // ====================================
      // RESET LOGIN STATE
      // ====================================
      user.loginAttempts = 0;

      user.lockUntil = null;

      user.isOnline = true;

      user.lastLogin =
        new Date();

      await user.save();


      // ====================================
      // GENERATE TOKEN
      // ====================================
      const token =
        generateToken(
          user._id
        );


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        message:
          "Login successful",

        token,

        user: {

          _id:
            user._id,

          identifier:
            user.identifier,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          avatar:
            user.avatar || "",

          isOnline:
            user.isOnline,

          isFirstLogin:
            user.isFirstLogin,

          createdAt:
            user.createdAt,

          lastLogin:
            user.lastLogin,

        },

      });

    }

    catch (error) {

      console.log(
        "LOGIN ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };

// =========================================
// LOGOUT USER
// =========================================
const logoutUser =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (user) {

        user.isOnline =
          false;

        user.lastSeen =
          new Date();

        await user.save();

      }


      res.status(200).json({

        success: true,

        message:
          "Logged out successfully",

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

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

        !isStrongPassword(
          newPassword
        )

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Password must contain uppercase, lowercase, number and minimum 8 characters",

        });

      }


      const user =
        await User.findById(
          req.user._id
        );


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

      await user.save();


      res.status(200).json({

        success: true,

        message:

          "Password changed successfully",

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

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


      const user =
        await User.findOne({

          identifier,

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
        identifier,
        otp
      );


      // SEND EMAIL
      if (user.email) {

        await sendEmail(

          user.email,

          "Your AlumniConnect OTP",

          `Your OTP is ${otp}. It expires in 15 minutes.`

        );

      }


      res.status(200).json({

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

      console.log(error);

      res.status(500).json({

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


      const user =
        await User.findOne({

          identifier,

        });


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      const existingOtp =
        await OtpRequest.findOne({

          identifier,

        });


      // COOLDOWN
      if (

        existingOtp &&
        existingOtp.lastSentAt &&

        Date.now() -

        new Date(
          existingOtp.lastSentAt
        ).getTime() <

        60 * 1000

      ) {

        return res.status(429).json({

          success: false,

          message:

            "Please wait before requesting another OTP",

        });

      }


      const otp =
        generateOtp();

      await saveOtpRequest(
        identifier,
        otp
      );


      if (user.email) {

        await sendEmail(

          user.email,

          "Your AlumniConnect OTP",

          `Your OTP is ${otp}. It expires in 15 minutes.`

        );

      }


      res.status(200).json({

        success: true,

        message:
          "OTP resent successfully",

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

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


      // DELETE OTP
      await OtpRequest.deleteOne({

        identifier,

      });


      res.status(200).json({

        success: true,

        message:
          "OTP verified successfully",

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

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


      if (

        !isStrongPassword(
          password
        )

      ) {

        return res.status(400).json({

          success: false,

          message:

            "Password must contain uppercase, lowercase, number and minimum 8 characters",

        });

      }


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

          identifier,

        });


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

      await user.save();


      // DELETE OTP
      await OtpRequest.deleteOne({

        identifier,

      });


      res.status(200).json({

        success: true,

        message:
          "Password reset successfully",

      });

    }

    catch (error) {

      console.log(error);

      res.status(500).json({

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

  verifyToken,

};