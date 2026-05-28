const mongoose =
  require("mongoose");


// ==========================================
// ATTENDEE SCHEMA
// ==========================================
const attendeeSchema =
  mongoose.Schema({

    student: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

    },

    studentName: {

      type: String,

      trim: true,

    },

    studentEmail: {

      type: String,

      trim: true,

      lowercase: true,

    },

    registeredAt: {

      type: Date,

      default: Date.now,

    },

    attended: {

      type: Boolean,

      default: false,

    },

    certificateIssued: {

      type: Boolean,

      default: false,

    },

  });


// ==========================================
// EVENT SCHEMA
// ==========================================
const eventSchema =
  mongoose.Schema(

    {

      // ====================================
      // EVENT INFO
      // ====================================
      title: {

        type: String,

        required: true,

        trim: true,

        maxlength: 200,

        index: true,

      },

      description: {

        type: String,

        required: true,

        trim: true,

        maxlength: 5000,

      },


      // ====================================
      // ORGANIZER
      // ====================================
      organizer: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        index: true,

      },

      organizerName: {

        type: String,

        trim: true,

      },


      // ====================================
      // EVENT TYPE
      // ====================================
      type: {

        type: String,

        enum: [

          "Workshop",

          "Webinar",

          "Networking",

          "Hackathon",

          "Mentorship",

          "Seminar",

          "Placement Drive",

        ],

        default: "Workshop",

        index: true,

      },


      // ====================================
      // EVENT STATUS
      // ====================================
      status: {

        type: String,

        enum: [

          "Upcoming",

          "Ongoing",

          "Completed",

          "Cancelled",

        ],

        default: "Upcoming",

        index: true,

      },


      // ====================================
      // DATE & TIME
      // ====================================
      date: {

        type: Date,

        required: true,

        index: true,

      },

      time: {

        type: String,

        trim: true,

      },

      duration: {

        type: Number,

        default: 60,

      },


      // ====================================
      // LOCATION
      // ====================================
      location: {

        type: String,

        trim: true,

      },

      mode: {

        type: String,

        enum: [

          "Online",

          "Offline",

          "Hybrid",

        ],

        default: "Online",

      },

      meetingLink: {

        type: String,

        trim: true,

      },


      // ====================================
      // EVENT MEDIA
      // ====================================
      bannerImage: {

        type: String,

        default: "",

      },


      // ====================================
      // REGISTRATION
      // ====================================
      registrationDeadline: {

        type: Date,

      },

      maxAttendees: {

        type: Number,

        default: 100,

      },


      // ====================================
      // ATTENDEES
      // ====================================
      attendees: [

        attendeeSchema,

      ],


      // ====================================
      // WAITLIST
      // ====================================
      waitlist: [

        {

          type:
            mongoose.Schema.Types.ObjectId,

          ref: "User",

        },

      ],


      // ====================================
      // TAGS
      // ====================================
      tags: [

        {

          type: String,

          trim: true,

        },

      ],


      // ====================================
      // ANALYTICS
      // ====================================
      totalRegistrations: {

        type: Number,

        default: 0,

      },

      attendanceCount: {

        type: Number,

        default: 0,

      },


      // ====================================
      // REMINDERS
      // ====================================
      reminderSent: {

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
eventSchema.index({

  title: "text",

  description: "text",

  tags: "text",

});


// ==========================================
// MODEL
// ==========================================
const Event =
  mongoose.model(

    "Event",

    eventSchema

  );


// ==========================================
// EXPORT
// ==========================================
module.exports =
  Event;