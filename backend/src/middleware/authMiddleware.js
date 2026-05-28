const jwt =
  require("jsonwebtoken");

const User =
  require("../models/User");


// ==========================================
// PROTECT ROUTES
// ==========================================
const protect =
  async (
    req,
    res,
    next
  ) => {

    try {

      let token;


      // ====================================
      // GET TOKEN
      // ====================================
      if (

        req.headers.authorization &&

        req.headers.authorization.startsWith(
          "Bearer "
        )

      ) {

        token =
          req.headers.authorization.split(
            " "
          )[1];

      }


      // ====================================
      // TOKEN CHECK
      // ====================================
      if (!token) {

        return res.status(401).json({

          success: false,

          message:
            "Access denied. No token provided",

        });

      }


      // ====================================
      // VERIFY TOKEN
      // ====================================
      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET

        );


      // ====================================
      // FIND USER
      // ====================================
      const user =
        await User.findById(
          decoded.id
        ).select("-password");


      // ====================================
      // USER NOT FOUND
      // ====================================
      if (!user) {

        return res.status(401).json({

          success: false,

          message:
            "User not found",

        });

      }


      // ====================================
      // INACTIVE USER
      // ====================================
      if (
        user.isActive === false
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Your account is inactive",

        });

      }


      // ====================================
      // UPDATE LAST ACTIVE
      // ====================================
      user.lastActive =
        new Date();

      await user.save();


      // ====================================
      // ATTACH USER
      // ====================================
      req.user = user;

      next();

    }

    catch (error) {

      console.log(
        "AUTH MIDDLEWARE ERROR:",
        error
      );


      // ==================================
      // TOKEN EXPIRED
      // ==================================
      if (
        error.name ===
        "TokenExpiredError"
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Token expired. Please login again",

        });

      }


      // ==================================
      // INVALID TOKEN
      // ==================================
      return res.status(401).json({

        success: false,

        message:
          "Invalid token",

      });

    }

  };


// ==========================================
// ROLE CHECK
// ==========================================
const roleCheck =
  (...roles) => {

    return (
      req,
      res,
      next
    ) => {

      try {

        // ================================
        // NO USER
        // ================================
        if (!req.user) {

          return res.status(401).json({

            success: false,

            message:
              "Unauthorized",

          });

        }


        // ================================
        // ROLE CHECK
        // ================================
        if (

          !roles.includes(
            req.user.role
          )

        ) {

          return res.status(403).json({

            success: false,

            message:
              "Access denied",

          });

        }


        next();

      }

      catch (error) {

        console.log(
          "ROLE CHECK ERROR:",
          error
        );

        return res.status(500).json({

          success: false,

          message:
            "Server Error",

        });

      }

    };

  };


// ==========================================
// ADMIN ONLY
// ==========================================
const adminOnly =
  roleCheck("admin");


// ==========================================
// ALUMNI ONLY
// ==========================================
const alumniOnly =
  roleCheck(
    "alumni",
    "admin"
  );


// ==========================================
// STUDENT ONLY
// ==========================================
const studentOnly =
  roleCheck("student");


// ==========================================
// EXPORTS
// ==========================================
module.exports = {

  protect,

  adminOnly,

  alumniOnly,

  studentOnly,

  roleCheck,

};