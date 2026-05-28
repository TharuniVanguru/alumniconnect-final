const express =
  require("express");

const multer =
  require("multer");

const path =
  require("path");

const {

  uploadResume,

  getMyResume,

  deleteResume,

} = require(
  "../controllers/resumeController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();


// ==========================================
// MULTER STORAGE
// ==========================================
const storage =
  multer.diskStorage({

    destination:
      (req, file, cb) => {

        cb(
          null,
          "uploads/resumes"
        );

      },

    filename:
      (req, file, cb) => {

        cb(

          null,

          `${Date.now()}-${file.originalname}`

        );

      },

  });


// ==========================================
// FILE FILTER
// ==========================================
const fileFilter =
  (req, file, cb) => {

    const allowedTypes = [

      "application/pdf",

      "application/msword",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    ];


    if (

      allowedTypes.includes(
        file.mimetype
      )

    ) {

      cb(null, true);

    }

    else {

      cb(

        new Error(
          "Only PDF/DOC/DOCX files allowed"
        ),

        false

      );

    }

  };


// ==========================================
// MULTER CONFIG
// ==========================================
const upload =
  multer({

    storage,

    fileFilter,

    limits: {

      fileSize:
        5 * 1024 * 1024,

    },

  });


// ==========================================
// TEST ROUTE
// ==========================================
router.get(

  "/",

  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "Resume Routes Working",

    });

  }

);


// ==========================================
// UPLOAD RESUME
// ==========================================
router.post(

  "/upload",

  protect,

  upload.single("resume"),

  uploadResume

);


// ==========================================
// GET MY RESUME
// ==========================================
router.get(

  "/my-resume",

  protect,

  getMyResume

);


// ==========================================
// DELETE RESUME
// ==========================================
router.delete(

  "/delete",

  protect,

  deleteResume

);


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports =
  router;