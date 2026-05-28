const fs =
  require("fs");

const path =
  require("path");

const User =
  require("../models/User");


// ==========================================
// UPLOAD RESUME
// ==========================================
const uploadResume =
  async (req, res) => {

    try {

      // ====================================
      // FILE CHECK
      // ====================================
      if (!req.file) {

        return res.status(400).json({

          success: false,

          message:
            "Resume file is required",

        });

      }


      // ====================================
      // ALLOWED TYPES
      // ====================================
      const allowedMimeTypes = [

        "application/pdf",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      ];


      if (

        !allowedMimeTypes.includes(
          req.file.mimetype
        )

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Only PDF/DOC/DOCX files allowed",

        });

      }


      // ====================================
      // FILE SIZE LIMIT
      // 5MB
      // ====================================
      if (
        req.file.size >
        5 * 1024 * 1024
      ) {

        return res.status(400).json({

          success: false,

          message:
            "File size should be below 5MB",

        });

      }


      // ====================================
      // UPDATE USER PROFILE
      // ====================================
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


      // DELETE OLD RESUME
      if (
        user.resumePath &&
        fs.existsSync(
          user.resumePath
        )
      ) {

        fs.unlinkSync(
          user.resumePath
        );

      }


      // SAVE NEW RESUME
      user.resumePath =
        req.file.path;

      user.resumeFileName =
        req.file.originalname;

      user.lastResumeUpload =
        new Date();


      // ====================================
      // SIMPLE AI SUMMARY
      // ====================================
      let resumeSummary =
        "Resume uploaded successfully";


      if (
        user.skills &&
        user.skills.length > 0
      ) {

        resumeSummary =
          `Experienced in ${user.skills.slice(0, 5).join(", ")}`;

      }


      user.resumeSummary =
        resumeSummary;


      await user.save();


      // ====================================
      // FILE INFO
      // ====================================
      const fileInfo = {

        filename:
          req.file.filename,

        originalname:
          req.file.originalname,

        mimetype:
          req.file.mimetype,

        size:
          req.file.size,

        path:
          req.file.path,

        summary:
          resumeSummary,

      };


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        message:
          "Resume uploaded successfully",

        file:
          fileInfo,

      });

    }

    catch (error) {

      console.log(
        "UPLOAD RESUME ERROR:",
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
// GET MY RESUME
// ==========================================
const getMyResume =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (
        !user ||
        !user.resumePath
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Resume not found",

        });

      }


      res.status(200).json({

        success: true,

        resume: {

          fileName:
            user.resumeFileName,

          path:
            user.resumePath,

          summary:
            user.resumeSummary,

          uploadedAt:
            user.lastResumeUpload,

        },

      });

    }

    catch (error) {

      console.log(
        "GET RESUME ERROR:",
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
// DELETE RESUME
// ==========================================
const deleteResume =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );


      if (
        !user ||
        !user.resumePath
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Resume not found",

        });

      }


      // ====================================
      // DELETE FILE
      // ====================================
      if (

        fs.existsSync(
          user.resumePath
        )

      ) {

        fs.unlinkSync(
          user.resumePath
        );

      }


      // ====================================
      // CLEAR DB FIELDS
      // ====================================
      user.resumePath = "";

      user.resumeFileName = "";

      user.resumeSummary = "";

      user.lastResumeUpload = null;


      await user.save();


      // ====================================
      // RESPONSE
      // ====================================
      res.status(200).json({

        success: true,

        message:
          "Resume deleted successfully",

      });

    }

    catch (error) {

      console.log(
        "DELETE RESUME ERROR:",
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

  uploadResume,

  getMyResume,

  deleteResume,

};