const mongoose =
  require("mongoose");


// ==========================================
// ATTENDEE SCHEMA
// ==========================================
const attendeeSchema =
  new mongoose.Schema(

    {

      // ====================================
      // STUDENT
      // ====================================
      student: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

      },


      // ====================================
      // STUDENT INFO
      // ====================================
      studentName: {

        type: String,

        trim: true,

      },

      studentEmail: {

        type: String,

        trim: true,

        lowercase: true,

      },


      // ====================================
      // REGISTRATION DATE
      // ====================================
      registeredAt: {

        type: Date,

        default: Date.now,

      },


      // ====================================
      // ATTENDANCE
      // ====================================
      attended: {

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

    },

    {

      _id: false,

    }

  );


// ==========================================
// EVENT SCHEMA
// ==========================================
const eventSchema =
  new mongoose.Schema(

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

          "Alumni Meet",

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
      // FEATURED EVENT
      // ====================================
      isFeatured: {

        type: Boolean,

        default: false,

        index: true,

      },


      // ====================================
      // EVENT VISIBILITY
      // ====================================
      visibility: {

        type: String,

        enum: [

          "Public",

          "Private",

        ],

        default: "Public",

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

        default: "Online",

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

        default: "",

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
      // TAGS
      // ====================================
      tags: [

        {

          type: String,

          trim: true,

          lowercase: true,

        },

      ],


      // ====================================
      // EVENT RATINGS
      // ====================================
      averageRating: {

        type: Number,

        default: 0,

        min: 0,

        max: 5,

      },

      totalRatings: {

        type: Number,

        default: 0,

      },


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

      totalViews: {

        type: Number,

        default: 0,

      },


      // ====================================
      // ACTIVE STATUS
      // ====================================
      isActive: {

        type: Boolean,

        default: true,

        index: true,

      },

    },

    {

      timestamps: true,

    }

  );


// ==========================================
// TEXT SEARCH INDEX
// ==========================================
eventSchema.index({

  title: "text",

  description: "text",

  tags: "text",

  location: "text",

});


// ==========================================
// COMPOUND INDEXES
// ==========================================
eventSchema.index({

  date: 1,

  status: 1,

});

eventSchema.index({

  organizer: 1,

  createdAt: -1,

});

eventSchema.index({

  type: 1,

  isActive: 1,

});

eventSchema.index({

  isFeatured: 1,

  createdAt: -1,

});


// ==========================================
// AUTO UPDATE STATUS
// ==========================================
eventSchema.pre(

  "save",

  function (next) {

    const now =
      new Date();


    // ====================================
    // AUTO EVENT STATUS
    // ====================================
    if (

      this.date < now &&

      this.status === "Upcoming"

    ) {

      this.status =
        "Completed";

    }


    // ====================================
    // ANALYTICS
    // ====================================
    this.totalRegistrations =
      this.attendees.length;

    this.attendanceCount =
      this.attendees.filter(

        (attendee) =>

          attendee.attended

      ).length;


    next();

  }

);


// ==========================================
// CHECK STUDENT REGISTERED
// ==========================================
eventSchema.methods.isRegistered =
  function (studentId) {

    return this.attendees.some(

      (attendee) =>

        attendee.student.toString()

        ===

        studentId.toString()

    );

  };


// ==========================================
// AVAILABLE SEATS
// ==========================================
eventSchema.virtual(

  "availableSeats"

).get(function () {

  return (

    this.maxAttendees -

    this.attendees.length

  );

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