// ==========================================
// IMPORTS
// ==========================================
const jwt =
  require("jsonwebtoken");

const User =
  require("../models/User");


// ==========================================
// VERIFY TOKEN HELPER
// ==========================================
const verifyToken =
  (token) => {

    return jwt.verify(

      token,

      process.env.JWT_SECRET

    );

  };


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
      // GET TOKEN FROM HEADER
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
      // TOKEN NOT FOUND
      // ====================================
      if (!token) {

        return res.status(401).json({

          success: false,

          message:
            "Access denied. No token provided",

        });

      }


      // ====================================
      // VERIFY JWT TOKEN
      // ====================================
      const decoded =
        verifyToken(token);


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
            "User no longer exists",

        });

      }


      // ====================================
      // ACCOUNT INACTIVE
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

      await user.save({

        validateBeforeSave:
          false,

      });


      // ====================================
      // ATTACH USER TO REQUEST
      // ====================================
      req.user = user;


      // ====================================
      // CONTINUE
      // ====================================
      next();

    }

    catch (error) {

      console.log(

        "AUTH ERROR:",

        error.message

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
      if (
        error.name ===
        "JsonWebTokenError"
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid token",

        });

      }


      // ==================================
      // DEFAULT ERROR
      // ==================================
      return res.status(500).json({

        success: false,

        message:
          "Authentication failed",

      });

    }

  };


// ==========================================
// AUTHORIZE ROLES
// ==========================================
const authorizeRoles =
  (...roles) => {

    return (
      req,
      res,
      next
    ) => {

      try {

        // ================================
        // USER CHECK
        // ================================
        if (!req.user) {

          return res.status(401).json({

            success: false,

            message:
              "Unauthorized access",

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

          "ROLE AUTH ERROR:",

          error.message

        );

        return res.status(500).json({

          success: false,

          message:
            "Authorization failed",

        });

      }

    };

  };


// ==========================================
// ADMIN ONLY
// ==========================================
const adminOnly =
  authorizeRoles(
    "admin"
  );


// ==========================================
// ALUMNI ONLY
// ==========================================
const alumniOnly =
  authorizeRoles(

    "alumni",

    "admin"

  );


// ==========================================
// STUDENT ONLY
// ==========================================
const studentOnly =
  authorizeRoles(

    "student",

    "admin"

  );


// ==========================================
// FACULTY ONLY
// ==========================================
const facultyOnly =
  authorizeRoles(

    "faculty",

    "admin"

  );


// ==========================================
// EXPORTS
// ==========================================
module.exports = {

  protect,

  authorizeRoles,

  adminOnly,

  alumniOnly,

  studentOnly,

  facultyOnly,

};