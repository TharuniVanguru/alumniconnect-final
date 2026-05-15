const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");


// GENERATE JWT TOKEN
const generateToken = (id) => {

  return jwt.sign(

    { id },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }

  );

};


// REGISTER USER
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

    // CHECK EXISTING USER
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

    // HASH PASSWORD
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // CREATE USER
    const user =
      await User.create({

        identifier,
        name,
        email,

        password:
          hashedPassword,

        role,

        // ONLINE STATUS
        isOnline: false,

      });

    // RESPONSE
    res.status(201).json({

      _id: user._id,

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

    res.status(500).json({
      message:
        error.message,
    });

  }

};


// LOGIN USER
const loginUser = async (
  req,
  res
) => {

  try {

    const {
      identifier,
      password
    } = req.body;

    // FIND USER
    const user =
      await User.findOne({
        identifier
      });

    if (!user) {

      return res.status(400).json({
        message:
          "Invalid credentials",
      });

    }

    // CHECK PASSWORD
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

    // RESPONSE
    res.status(200).json({

      _id: user._id,

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

    res.status(500).json({
      message:
        error.message,
    });

  }

};


// LOGOUT USER
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


module.exports = {

  registerUser,

  loginUser,

  logoutUser,

};