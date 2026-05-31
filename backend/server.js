const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const connectDB =
  require("./src/config/db");


// ==========================================
// LOAD ENV
// ==========================================
dotenv.config();


// ==========================================
// CHECK JWT SECRET
// ==========================================
if (!process.env.JWT_SECRET) {

  console.log(
    "❌ JWT_SECRET Missing"
  );

  process.exit(1);

}


// ==========================================
// CONNECT DATABASE
// ==========================================
connectDB();


// ==========================================
// EXPRESS APP
// ==========================================
const app = express();


// ==========================================
// TRUST PROXY
// ==========================================
app.set(
  "trust proxy",
  1
);


// ==========================================
// HTTP SERVER
// ==========================================
const server =
  http.createServer(app);


// ==========================================
// ALLOWED ORIGINS
// ==========================================
const allowedOrigins = [

  "http://localhost:3000",

  "http://localhost:5173",

  "http://localhost:8080",

  "http://localhost:8081",

  process.env.FRONTEND_URL,

].filter(Boolean);


// ==========================================
// SOCKET IO
// ==========================================
const io =
  new Server(server, {

    cors: {

      origin:
        allowedOrigins,

      credentials: true,

      methods: [
        "GET",
        "POST",
      ],

    },

    pingTimeout: 60000,

  });


// ==========================================
// SOCKET AUTH
// ==========================================
io.use(

  async (
    socket,
    next
  ) => {

    try {

      const token =
        socket.handshake.auth?.token;

      if (!token) {

        return next(
          new Error(
            "Unauthorized"
          )
        );

      }

      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET

        );

      socket.userId =
        decoded.id;

      next();

    }

    catch (error) {

      console.log(
        "SOCKET AUTH ERROR:",
        error.message
      );

      next(
        new Error(
          "Invalid Token"
        )
      );

    }

  }

);


// ==========================================
// SECURITY MIDDLEWARE
// ==========================================
app.use(
  helmet()
);


// ==========================================
// RATE LIMITER
// ==========================================
const limiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 500,

    standardHeaders: true,

    legacyHeaders: false,

    message: {

      success: false,

      message:
        "Too many requests. Please try again later.",

    },

  });

app.use(
  limiter
);


// ==========================================
// CORS
// ==========================================
app.use(

  cors({

    origin: function (
      origin,
      callback
    ) {

      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {

        callback(
          null,
          true
        );

      }

      else {

        callback(
          new Error(
            "Not allowed by CORS"
          )
        );

      }

    },

    credentials: true,

  })

);


// ==========================================
// LOGGER
// ==========================================
app.use(
  morgan("dev")
);


// ==========================================
// BODY PARSER
// ==========================================
app.use(

  express.json({

    limit: "10mb",

  })

);

app.use(

  express.urlencoded({

    extended: true,

    limit: "10mb",

  })

);


// ==========================================
// STATIC FILES
// ==========================================
app.use(

  "/uploads",

  express.static(

    path.join(
      __dirname,
      "uploads"
    )

  )

);


// ==========================================
// TEST ROUTE
// ==========================================
app.get(

  "/test",

  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "Backend Working Properly",

    });

  }

);


// ==========================================
// HEALTH CHECK
// ==========================================
app.get(

  "/health",

  (req, res) => {

    res.status(200).json({

      success: true,

      status: "OK",

      uptime:
        process.uptime(),

      timestamp:
        new Date(),

    });

  }

);


// ==========================================
// ONLINE USERS
// ==========================================
const onlineUsers =
  new Map();


// ==========================================
// ADD USER SOCKET
// ==========================================
const addUserSocket =
  (
    userId,
    socketId
  ) => {

    if (
      !onlineUsers.has(userId)
    ) {

      onlineUsers.set(
        userId,
        new Set()
      );

    }

    onlineUsers
      .get(userId)
      .add(socketId);

  };


// ==========================================
// REMOVE USER SOCKET
// ==========================================
const removeUserSocket =
  (socketId) => {

    for (

      const [
        userId,
        socketSet,
      ]

      of onlineUsers.entries()

    ) {

      socketSet.delete(
        socketId
      );

      if (
        socketSet.size === 0
      ) {

        onlineUsers.delete(
          userId
        );

      }

    }

  };


// ==========================================
// SOCKET CONNECTION
// ==========================================
io.on(

  "connection",

  (socket) => {

    console.log(

      `🟢 User Connected: ${socket.id}`

    );

    const userId =
      socket.userId;


    // ======================================
    // JOIN ROOM
    // ======================================
    if (userId) {

      socket.join(userId);

      addUserSocket(

        userId,

        socket.id

      );

    }


    // ======================================
    // ONLINE USERS
    // ======================================
    io.emit(

      "onlineUsers",

      Array.from(
        onlineUsers.keys()
      )

    );


    // ======================================
    // SEND MESSAGE
    // ======================================
    socket.on(

      "sendMessage",

      (data) => {

        try {

          if (

            !data ||
            !data.receiverId ||
            !data.message

          ) {

            return;

          }

          io.to(
            data.receiverId
          ).emit(

            "receiveMessage",

            data

          );

        }

        catch (error) {

          console.log(
            "SEND MESSAGE ERROR:",
            error.message
          );

        }

      }

    );


    // ======================================
    // USER TYPING
    // ======================================
    socket.on(

      "typing",

      (data) => {

        io.to(
          data.receiverId
        ).emit(

          "userTyping",

          {

            senderId:
              userId,

          }

        );

      }

    );


    // ======================================
    // STOP TYPING
    // ======================================
    socket.on(

      "stopTyping",

      (data) => {

        io.to(
          data.receiverId
        ).emit(

          "userStopTyping",

          {

            senderId:
              userId,

          }

        );

      }

    );


    // ======================================
    // MESSAGE DELIVERED
    // ======================================
    socket.on(

      "messageDelivered",

      (data) => {

        io.to(
          data.senderId
        ).emit(

          "messageDelivered",

          {

            messageId:
              data.messageId,

            status:
              "delivered",

          }

        );

      }

    );


    // ======================================
    // MESSAGE SEEN
    // ======================================
    socket.on(

      "messageSeen",

      (data) => {

        io.to(
          data.senderId
        ).emit(

          "messageSeen",

          {

            messageId:
              data.messageId,

            seenBy:
              userId,

          }

        );

      }

    );


    // ======================================
    // DISCONNECT
    // ======================================
    socket.on(

      "disconnect",

      () => {

        removeUserSocket(
          socket.id
        );

        io.emit(

          "onlineUsers",

          Array.from(
            onlineUsers.keys()
          )

        );

        console.log(

          `🔴 User Disconnected: ${socket.id}`

        );

      }

    );

  }

);


// ==========================================
// ROUTES IMPORT
// ==========================================
const authRoutes =
  require("./src/routes/authRoutes");

const profileRoutes =
  require("./src/routes/profileRoutes");

const jobRoutes =
  require("./src/routes/jobRoutes");

const eventRoutes =
  require("./src/routes/eventRoutes");

const mentorshipRoutes =
  require("./src/routes/mentorshipRoutes");

const notificationRoutes =
  require("./src/routes/notificationRoutes");

const messageRoutes =
  require("./src/routes/messageRoutes");

const userRoutes =
  require("./src/routes/userRoutes");

const guidanceRoutes =
  require("./src/routes/guidanceRoutes");

const recommendationRoutes =
  require("./src/routes/recommendationRoutes");

const chatbotRoutes =
  require("./src/routes/chatbotRoutes");

const adminRoutes =
  require("./src/routes/adminRoutes");

const searchRoutes =
  require("./src/routes/searchRoutes");

const resumeRoutes =
  require("./src/routes/resumeRoutes");


// ==========================================
// API ROUTES
// ==========================================
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/profile",
  profileRoutes
);

app.use(
  "/api/jobs",
  jobRoutes
);

app.use(
  "/api/events",
  eventRoutes
);

app.use(
  "/api/mentorship",
  mentorshipRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/guidance",
  guidanceRoutes
);

app.use(
  "/api/recommendations",
  recommendationRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/ai",
  chatbotRoutes
);

app.use(
  "/api/search",
  searchRoutes
);

app.use(
  "/api/resume",
  resumeRoutes
);

// ==========================================
// ROOT-LEVEL DUPLICATE ROUTES FOR FRONTEND
// ==========================================
app.use(
  "/auth",
  authRoutes
);

app.use(
  "/profile",
  profileRoutes
);

app.use(
  "/jobs",
  jobRoutes
);

app.use(
  "/events",
  eventRoutes
);

app.use(
  "/mentorship",
  mentorshipRoutes
);

app.use(
  "/notifications",
  notificationRoutes
);

app.use(
  "/messages",
  messageRoutes
);

app.use(
  "/users",
  userRoutes
);

app.use(
  "/guidance",
  guidanceRoutes
);

app.use(
  "/recommendations",
  recommendationRoutes
);

app.use(
  "/admin",
  adminRoutes
);

app.use(
  "/ai",
  chatbotRoutes
);

app.use(
  "/search",
  searchRoutes
);

app.use(
  "/resume",
  resumeRoutes
);


// ==========================================
// ROOT ROUTE
// ==========================================
app.get(

  "/",

  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "🚀 AlumniConnect Backend Running",

      serverTime:
        new Date(),

    });

  }

);


// ==========================================
// 404 HANDLER
// ==========================================
app.use(

  (req, res) => {

    res.status(404).json({

      success: false,

      message:
        "API Route Not Found",

    });

  }

);


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================
app.use(

  (
    err,
    req,
    res,
    next
  ) => {

    console.log(
      "GLOBAL ERROR:",
      err.message
    );

    res.status(

      err.statusCode || 500

    ).json({

      success: false,

      message:

        process.env.NODE_ENV ===
        "production"

          ? "Internal Server Error"

          : err.message,

    });

  }

);


// ==========================================
// START SERVER
// ==========================================
const PORT =
  process.env.PORT || 5000;

server.listen(

  PORT,

  () => {

    console.log(

      `🚀 Server running on port ${PORT}`

    );

    console.log(

      `✅ Test URL: http://localhost:${PORT}/test`

    );

  }

);


// ==========================================
// HANDLE UNHANDLED REJECTION
// ==========================================
process.on(

  "unhandledRejection",

  (err) => {

    console.log(

      "UNHANDLED REJECTION:",

      err.message

    );

    server.close(
      () => process.exit(1)
    );

  }

);


// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================
process.on(

  "SIGINT",

  () => {

    console.log(
      "🛑 Server shutting down..."
    );

    server.close(() => {

      process.exit(0);

    });

  }

);


// ==========================================
// EXPORT IO
// ==========================================
module.exports = {

  io,

};