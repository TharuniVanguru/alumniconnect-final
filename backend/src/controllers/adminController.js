const bcrypt = require("bcryptjs");
const xlsx = require("xlsx");

const User = require("../models/User");

const createUserFromRow = async (row) => {
  const {
    identifier,
    name,
    email,
    phone,
    branch,
    batch,
    role,
    defaultPassword,
  } = row;

  if (!identifier || !name || !email || !defaultPassword) {
    return null;
  }

  const existingUser = await User.findOne({ identifier });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(defaultPassword.toString(), salt);

  const isFirstLogin = existingUser ? existingUser.isFirstLogin : true;

  const userData = {
    identifier: identifier.toString(),
    name: name.toString(),
    email: email.toString(),
    phone: phone ? phone.toString() : "",
    branch: branch ? branch.toString() : "",
    batch: batch ? batch.toString() : "",
    role: role ? role.toString().toLowerCase() : "student",
    password: hashedPassword,
    isActive: true,
    isFirstLogin,
  };

  if (existingUser) {
    Object.assign(existingUser, userData);
    return await existingUser.save();
  }

  return await User.create(userData);
};

const ensureAdmin = (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return false;
  }
  if (!["admin", "faculty"].includes(req.user.role)) {
    res.status(403).json({ message: "Admin access required" });
    return false;
  }
  return true;
};

const uploadExcel = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });

    const results = [];
    for (const row of rows) {
      const existingUser = await User.findOne({ identifier: row.identifier });
      const created = await createUserFromRow(row);
      if (created) {
        results.push({ identifier: created.identifier, status: existingUser ? "updated" : "created" });
      }
    }

    res.status(200).json({
      message: "Excel processed successfully",
      count: results.length,
      results,
    });
  } catch (error) {
    console.log("EXCEL UPLOAD ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getUsers = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log("GET USERS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const blockUser = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  try {
    const { userId, isActive } = req.body;
    if (!userId || typeof isActive !== "boolean") {
      return res.status(400).json({ message: "userId and isActive are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      message: isActive ? "User unblocked" : "User blocked",
      user: {
        _id: user._id,
        identifier: user.identifier,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.log("BLOCK USER ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  uploadExcel,
  getUsers,
  blockUser,
};
