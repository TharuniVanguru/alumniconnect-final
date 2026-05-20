const User = require("../models/User");
const OtpRequest = require("../models/OtpRequest");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");


// =========================
// GENERATE JWT TOKEN
// =========================
const generateToken = (id) => {

  return jwt.sign(

    { id },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }

  );

};


// =========================
// EMAIL TRANSPORTER
// =========================
const getTransporter = () => {

  if (

    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS

  ) {

    return nodemailer.createTransport({

      host:
        process.env.EMAIL_HOST,

      port:
        Number(process.env.EMAIL_PORT) || 587,

      secure:
        process.env.EMAIL_SECURE === "true",

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


// =========================
// SEND EMAIL
// =========================
const sendEmail = async (

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


// =========================
// HELPERS
// =========================
const maskEmail = (email) => {

  if (!email) return "";

  const [
    local,
    domain
  ] = email.split("@");

  return `${local.slice(0, 2)}*****@${domain}`;

};


const maskPhone = (phone) => {

  if (!phone) return "";

  return `${phone.slice(0, 2)}******${phone.slice(-2)}`;

};


const generateOtp = () => {

  return Math.floor(

    100000 +
    Math.random() * 900000

  ).toString();

};


// =========================
// SAVE OTP
// =========================
const saveOtpRequest = async (

  identifier,
  otp

) => {

  return await OtpRequest.findOneAndUpdate(

    { identifier },

    {

      otp,

      expiresAt:
        new Date(
          Date.now() +
          15 * 60 * 1000
        ),

      attempts: 0,

    },

    {

      upsert: true,
      new: true,

    }

  );

};


// =========================
// VALIDATE OTP
// =========================
const validateOtpRequest = async (

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
      reason: "OTP not found",

    };

  }

  if (
    record.expiresAt < new Date()
  ) {

    return {

      valid: false,
      reason: "OTP expired",

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

    await record.save();

    return {

      valid: false,
      reason: "OTP invalid",

    };

  }

  return {

    valid: true,
    record,

  };

};


// =========================
// REGISTER USER
// =========================
const registerUser = async (
  req,
  res
) => {

  try {

    const {

      identifier,
      name,
      email,
      password,
      role,

    } = req.body;


    const existingUser =
      await User.findOne({

        $or: [

          { email },

          { identifier },

        ],

      });


    if (existingUser) {

      return res.status(400).json({

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

        identifier,

        name,

        email,

        password:
          hashedPassword,

        role,

        isOnline: false,

        isActive: true,

      });


    res.status(201).json({

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

      isOnline:
        user.isOnline,

      token:
        generateToken(
          user._id
        ),

    });

  }

  catch (error) {

    console.log(
      "REGISTER ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Server Error",

    });

  }

};


// =========================
// LOGIN USER
// =========================
const loginUser = async (
  req,
  res
) => {

  try {

    const {

      identifier,
      password,
      role,

    } = req.body;


    console.log(
      "LOGIN REQUEST:",
      req.body
    );


    // FIND USER
    const user =
      await User.findOne({

        identifier,

      });


    // USER NOT FOUND
    if (!user) {

      return res.status(400).json({

        message:
          "Invalid credentials",

      });

    }


    // ROLE CHECK
    if (
      user.role !== role
    ) {

      return res.status(400).json({

        message:
          "Invalid role selected",

      });

    }


    // ACTIVE CHECK
    if (
      user.isActive === false
    ) {

      return res.status(403).json({

        message:
          "Account inactive",

      });

    }


    // PASSWORD CHECK
    const isMatch =
      await bcrypt.compare(

        password,

        user.password

      );


    if (!isMatch) {

      return res.status(400).json({

        message:
          "Invalid credentials",

      });

    }


    // UPDATE ONLINE STATUS
    user.isOnline = true;

    await user.save();


    // SUCCESS RESPONSE
    res.status(200).json({

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

      isOnline:
        user.isOnline,

      isFirstLogin:
        user.isFirstLogin,

      token:
        generateToken(
          user._id
        ),

    });

  }

  catch (error) {

    console.log(
      "LOGIN ERROR:",
      error
    );

    res.status(500).json({

      message:
        "Server Error",

    });

  }

};


// =========================
// LOGOUT USER
// =========================
const logoutUser = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.user._id
      );

    if (user) {

      user.isOnline = false;

      await user.save();

    }

    res.status(200).json({

      message:
        "Logged out successfully",

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Server Error",

    });

  }

};


// =========================
// CHANGE PASSWORD
// =========================
const changePassword = async (
  req,
  res
) => {

  try {

    const {

      oldPassword,
      newPassword,

    } = req.body;


    const user =
      await User.findById(
        req.user._id
      );


    if (!user) {

      return res.status(404).json({

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

    user.isFirstLogin = false;

    await user.save();


    res.status(200).json({

      message:
        "Password changed successfully",

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Server Error",

    });

  }

};


// =========================
// FORGOT PASSWORD
// =========================
const forgotPassword = async (
  req,
  res
) => {

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


    if (user.email) {

      await sendEmail(

        user.email,

        "Your AlumniConnect OTP",

        `Your OTP is ${otp}. It expires in 15 minutes.`

      );

    }


    res.status(200).json({

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

      message:
        "Server Error",

    });

  }

};


// =========================
// VERIFY OTP
// =========================
const verifyOtp = async (
  req,
  res
) => {

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

        message:
          result.reason,

      });

    }


    res.status(200).json({

      message:
        "OTP verified successfully",

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Server Error",

    });

  }

};


// =========================
// RESET PASSWORD
// =========================
const resetPassword = async (
  req,
  res
) => {

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

    user.isFirstLogin = false;

    await user.save();


    await OtpRequest.deleteOne({

      identifier,

    });


    res.status(200).json({

      message:
        "Password reset successfully",

    });

  }

  catch (error) {

    console.log(error);

    res.status(500).json({

      message:
        "Server Error",

    });

  }

};


module.exports = {

  registerUser,

  loginUser,

  logoutUser,

  changePassword,

  forgotPassword,

  verifyOtp,

  resetPassword,

};