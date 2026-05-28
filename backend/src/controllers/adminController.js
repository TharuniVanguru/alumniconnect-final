const bcrypt = require("bcryptjs");

const xlsx = require("xlsx");

const User =
  require("../models/User");

const Job =
  require("../models/Job");

const Event =
  require("../models/Event");

const GuidanceRequest =
  require("../models/GuidanceRequest");

const Mentorship =
  require("../models/Mentorship");

const Message =
  require("../models/Message");


// ==========================================
// CREATE USER FROM EXCEL ROW
// ==========================================
const createUserFromRow =
  async (row) => {

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


    // ======================================
    // REQUIRED VALIDATION
    // ======================================
    if (

      !identifier ||
      !name ||
      !email ||
      !defaultPassword

    ) {

      return null;

    }


    // ======================================
    // VALID ROLES
    // ======================================
    const validRoles = [

      "student",

      "alumni",

      "faculty",

      "admin",

    ];


    const normalizedRole =

      role
        ? role.toString().toLowerCase()
        : "student";


    if (

      !validRoles.includes(
        normalizedRole
      )

    ) {

      throw new Error(

        `Invalid role: ${role}`

      );

    }


    // ======================================
    // CHECK EXISTING USER
    // ======================================
    const existingUser =
      await User.findOne({

        identifier:
          identifier.toString(),

      });


    // ======================================
    // HASH PASSWORD
    // ======================================
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(

        defaultPassword.toString(),

        salt

      );


    // ======================================
    // USER DATA
    // ======================================
    const userData = {

      identifier:
        identifier.toString(),

      name:
        name.toString(),

      email:
        email.toString(),

      phone:
        phone
          ? phone.toString()
          : "",

      branch:
        branch
          ? branch.toString()
          : "",

      batch:
        batch
          ? batch.toString()
          : "",

      role:
        normalizedRole,

      password:
        hashedPassword,

      isActive:
        true,

      isFirstLogin:
        existingUser
          ? existingUser.isFirstLogin
          : true,

      trustScore:
        40,

      isVerified:
        true,

    };


    // ======================================
    // UPDATE EXISTING USER
    // ======================================
    if (existingUser) {

      Object.assign(

        existingUser,

        userData

      );

      return await existingUser.save();

    }


    // ======================================
    // CREATE NEW USER
    // ======================================
    return await User.create(
      userData
    );

  };


// ==========================================
// ADMIN AUTHORIZATION
// ==========================================
const ensureAdmin =
  (req, res) => {

    if (!req.user) {

      res.status(401).json({

        success: false,

        message:
          "Not authorized",

      });

      return false;

    }


    if (

      ![
        "admin",
        "faculty",
      ].includes(
        req.user.role
      )

    ) {

      res.status(403).json({

        success: false,

        message:
          "Admin access required",

      });

      return false;

    }

    return true;

  };


// ==========================================
// EXCEL UPLOAD
// ==========================================
const uploadExcel =
  async (req, res) => {

    if (
      !ensureAdmin(req, res)
    ) return;


    try {

      // ====================================
      // FILE VALIDATION
      // ====================================
      if (

        !req.file ||
        !req.file.buffer

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Excel file is required",

        });

      }


      // ====================================
      // READ EXCEL
      // ====================================
      const workbook =
        xlsx.read(

          req.file.buffer,

          {
            type: "buffer",
          }

        );

      const sheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const rows =
        xlsx.utils.sheet_to_json(
          sheet,
          {
            defval: "",
          }
        );


      // ====================================
      // PROCESS ROWS
      // ====================================
      let createdCount = 0;

      let updatedCount = 0;

      const results = [];


      for (const row of rows) {

        const existingUser =
          await User.findOne({

            identifier:
              row.identifier
                ?.toString(),

          });


        const user =
          await createUserFromRow(
            row
          );


        if (user) {

          if (existingUser) {

            updatedCount++;

          }

          else {

            createdCount++;

          }


          results.push({

            identifier:
              user.identifier,

            name:
              user.name,

            role:
              user.role,

            status:
              existingUser
                ? "updated"
                : "created",

          });

        }

      }


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        message:
          "Excel processed successfully",

        total:
          results.length,

        createdCount,

        updatedCount,

        results,

      });

    }

    catch (error) {

      console.log(

        "EXCEL UPLOAD ERROR:",

        error

      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// GET USERS
// ==========================================
const getUsers =
  async (req, res) => {

    if (
      !ensureAdmin(req, res)
    ) return;


    try {

      const users =
        await User.find()

          .select("-password")

          .sort({
            createdAt: -1,
          });


      res.status(200).json({

        success: true,

        total:
          users.length,

        users,

      });

    }

    catch (error) {

      console.log(
        "GET USERS ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// BLOCK / UNBLOCK USER
// ==========================================
const blockUser =
  async (req, res) => {

    if (
      !ensureAdmin(req, res)
    ) return;


    try {

      const {

        userId,
        isActive,

      } = req.body;


      // ====================================
      // VALIDATION
      // ====================================
      if (

        !userId ||

        typeof isActive !==
          "boolean"

      ) {

        return res.status(400).json({

          success: false,

          message:

            "userId and isActive are required",

        });

      }


      // ====================================
      // FIND USER
      // ====================================
      const user =
        await User.findById(
          userId
        );

      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",

        });

      }


      // ====================================
      // UPDATE STATUS
      // ====================================
      user.isActive =
        isActive;

      await user.save();


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        message:

          isActive
            ? "User unblocked"
            : "User blocked",

        user: {

          _id:
            user._id,

          identifier:
            user.identifier,

          name:
            user.name,

          role:
            user.role,

          isActive:
            user.isActive,

        },

      });

    }

    catch (error) {

      console.log(
        "BLOCK USER ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// ADMIN DASHBOARD ANALYTICS
// ==========================================
const getDashboardAnalytics =
  async (req, res) => {

    if (
      !ensureAdmin(req, res)
    ) return;


    try {

      // ==================================
      // TOTAL USERS
      // ==================================
      const totalUsers =
        await User.countDocuments();

      const totalStudents =
        await User.countDocuments({

          role: "student",

        });

      const totalAlumni =
        await User.countDocuments({

          role: "alumni",

        });

      const totalFaculty =
        await User.countDocuments({

          role: "faculty",

        });


      // ==================================
      // ACTIVE USERS
      // ==================================
      const activeUsers =
        await User.countDocuments({

          isActive: true,

        });

      const blockedUsers =
        await User.countDocuments({

          isActive: false,

        });


      // ==================================
      // ONLINE USERS
      // ==================================
      const onlineUsers =
        await User.countDocuments({

          isOnline: true,

        });


      // ==================================
      // VERIFIED USERS
      // ==================================
      const verifiedUsers =
        await User.countDocuments({

          isVerified: true,

        });


      // ==================================
      // PLATFORM STATS
      // ==================================
      const totalJobs =
        await Job.countDocuments();

      const totalEvents =
        await Event.countDocuments();

      const totalGuidanceRequests =
        await GuidanceRequest.countDocuments();

      const totalMentorships =
        await Mentorship.countDocuments();

      const totalMessages =
        await Message.countDocuments();


      // ==================================
      // TOP DOMAINS
      // ==================================
      const topDomains =
        await User.aggregate([

          {

            $group: {

              _id:
                "$domain",

              count: {

                $sum: 1,

              },

            },

          },

          {

            $sort: {

              count: -1,

            },

          },

          {

            $limit: 5,

          },

        ]);


      // ==================================
      // TOP SKILLS
      // ==================================
      const topSkills =
        await User.aggregate([

          {

            $unwind:
              "$skills",

          },

          {

            $group: {

              _id:
                "$skills",

              count: {

                $sum: 1,

              },

            },

          },

          {

            $sort: {

              count: -1,

            },

          },

          {

            $limit: 10,

          },

        ]);


      // ==================================
      // RECENT USERS
      // ==================================
      const recentUsers =
        await User.find()

          .select(
            "name role createdAt"
          )

          .sort({
            createdAt: -1,
          })

          .limit(5);


      // ==================================
      // RESPONSE
      // ==================================
      res.status(200).json({

        success: true,

        analytics: {

          totalUsers,
          totalStudents,
          totalAlumni,
          totalFaculty,

          activeUsers,
          blockedUsers,
          onlineUsers,
          verifiedUsers,

          totalJobs,
          totalEvents,
          totalGuidanceRequests,
          totalMentorships,
          totalMessages,

          topDomains,
          topSkills,

          recentUsers,

        },

      });

    }

    catch (error) {

      console.log(

        "DASHBOARD ANALYTICS ERROR:",

        error

      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ==========================================
// EXPORTS
// ==========================================
module.exports = {

  uploadExcel,

  getUsers,

  blockUser,

  getDashboardAnalytics,

};