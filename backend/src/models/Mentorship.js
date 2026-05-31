const mongoose =
  require("mongoose");


// ==========================================
// RESOURCE SCHEMA
// ==========================================
const resourceSchema =
  new mongoose.Schema(

    {

      title: {

        type: String,

        trim: true,

        maxlength: 200,

      },

      link: {

        type: String,

        trim: true,

      },

    },

    {

      _id: false,

    }

  );


// ==========================================
// MENTORSHIP SCHEMA
// ==========================================
const mentorshipSchema =
  mongoose.Schema(

    {

      // ====================================
      // STUDENT
      // ====================================
      student: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,

      },

      studentName: {

        type: String,

        trim: true,

        maxlength: 100,

      },


      // ====================================
      // ALUMNI / MENTOR
      // ====================================
      alumni: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,

      },

      alumniName: {

        type: String,

        trim: true,

        maxlength: 100,

      },


      // ====================================
      // REQUEST MESSAGE
      // ====================================
      message: {

        type: String,

        required: true,

        trim: true,

        maxlength: 2000,

      },


      // ====================================
      // DOMAIN
      // ====================================
      domain: {

        type: String,

        trim: true,

        index: true,

        default: "",

      },


      // ====================================
      // MENTORSHIP TYPE
      // ====================================
      mentorshipType: {

        type: String,

        enum: [

          "Career Guidance",

          "Interview Preparation",

          "Project Help",

          "Resume Review",

          "Placement Mentorship",

          "General Mentorship",

        ],

        default:
          "General Mentorship",

        index: true,

      },


      // ====================================
      // STATUS
      // ====================================
      status: {

        type: String,

        enum: [

          "Pending",

          "Accepted",

          "Rejected",

          "Scheduled",

          "Completed",

          "Cancelled",

        ],

        default: "Pending",

        index: true,

      },


      // ====================================
      // MEETING INFO
      // ====================================
      scheduledDate: {

        type: Date,

        default: null,

      },

      meetingLink: {

        type: String,

        trim: true,

        default: "",

      },

      duration: {

        type: Number,

        default: 30,

        min: 15,

      },

      meetingCompleted: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // SESSION TRACKING
      // ====================================
      sessionStartedAt: {

        type: Date,

        default: null,

      },

      sessionEndedAt: {

        type: Date,

        default: null,

      },


      // ====================================
      // NOTES
      // ====================================
      mentorNotes: {

        type: String,

        default: "",

        maxlength: 3000,

      },

      studentNotes: {

        type: String,

        default: "",

        maxlength: 3000,

      },


      // ====================================
      // RESOURCES
      // ====================================
      resources: [

        resourceSchema,

      ],


      // ====================================
      // FEEDBACK
      // ====================================
      feedback: {

        type: String,

        trim: true,

        maxlength: 1000,

        default: "",

      },

      rating: {

        type: Number,

        min: 1,

        max: 5,

        default: null,

      },


      // ====================================
      // AI MATCH SCORE
      // ====================================
      aiMatchScore: {

        type: Number,

        default: 0,

        min: 0,

        max: 100,

      },


      // ====================================
      // CANCELLATION
      // ====================================
      cancellationReason: {

        type: String,

        default: "",

        maxlength: 1000,

      },


      // ====================================
      // REMINDERS
      // ====================================
      reminderSent: {

        type: Boolean,

        default: false,

      },

      followUpSent: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // CERTIFICATE
      // ====================================
      certificateIssued: {

        type: Boolean,

        default: false,

      },


      // ====================================
      // ACTIVE STATUS
      // ====================================
      isActive: {

        type: Boolean,

        default: true,

      },

    },

    {

      timestamps: true,

    }

  );


// ==========================================
// INDEXES
// ==========================================
mentorshipSchema.index({

  student: 1,

  alumni: 1,

  status: 1,

});

mentorshipSchema.index({

  domain: 1,

  mentorshipType: 1,

});

mentorshipSchema.index({

  scheduledDate: 1,

});

mentorshipSchema.index({

  createdAt: -1,

});


// ==========================================
// PRE SAVE MIDDLEWARE
// ==========================================
mentorshipSchema.pre(

  "save",

  function (next) {

    // ====================================
    // AUTO COMPLETE
    // ====================================
    if (

      this.status === "Completed"

    ) {

      this.meetingCompleted =
        true;

    }

    next();

  }

);


// ==========================================
// VIRTUAL SESSION DURATION
// ==========================================
mentorshipSchema.virtual(

  "sessionDuration"

).get(function () {

  if (

    this.sessionStartedAt &&

    this.sessionEndedAt

  ) {

    return Math.floor(

      (
        this.sessionEndedAt -

        this.sessionStartedAt

      ) /

      (1000 * 60)

    );

  }

  return 0;

});


// ==========================================
// MODEL
// ==========================================
const Mentorship =
  mongoose.model(

    "Mentorship",

    mentorshipSchema

  );


// ==========================================
// EXPORT
// ==========================================
module.exports =
  Mentorship;