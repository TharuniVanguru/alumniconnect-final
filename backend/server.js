const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

const http = require("http");

const helmet = require("helmet");

const rateLimit = require("express-rate-limit");

const morgan = require("morgan");

const path = require("path");

const { Server } =
  require("socket.io");

const connectDB =
  require("./src/config/db");


// ==========================================
// LOAD ENV
// ==========================================
dotenv.config();


// ==========================================
// ENV VALIDATION
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
const app =
  express();


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

];


// ==========================================
// SOCKET.IO
// ==========================================
const io =
  new Server(server, {

    cors: {

      origin:
        allowedOrigins,

      methods: [

        "GET",

        "POST",

        "PUT",

        "DELETE",

      ],

      credentials: true,

    },

    pingTimeout: 60000,

  });


// ==========================================
// ROUTES
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
// SECURITY MIDDLEWARE
// ==========================================
app.use(helmet());


// ==========================================
// RATE LIMITER
// ==========================================
const limiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 300,

    message: {

      success: false,

      message:
        "Too many requests. Please try again later.",

    },

  });

app.use(limiter);


// ==========================================
// CORS
// ==========================================
app.use(

  cors({

    origin:
      allowedOrigins,

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
// ONLINE USERS MAP
// userId => Set(socketIds)
// ==========================================
const onlineUsers =
  new Map();


// ==========================================
// ADD USER SOCKET
// ==========================================
const addUserSocket = (
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
// GET USER SOCKETS
// ==========================================
const getUserSockets =
  (userId) => {

    return Array.from(

      onlineUsers.get(
        userId.toString()
      ) || []

    );

  };


// ==========================================
// SOCKET CONNECTION
// ==========================================
io.on(

  "connection",

  (socket) => {

    console.log(

      "🟢 User Connected:",

      socket.id

    );


    // ======================================
    // JOIN ROOM
    // ======================================
    socket.on(

      "joinRoom",

      (userId) => {

        if (!userId)
          return;

        const userIdString =
          userId.toString();

        socket.join(
          userIdString
        );

        addUserSocket(

          userIdString,

          socket.id

        );

        io.emit(

          "onlineUsers",

          Array.from(
            onlineUsers.keys()
          )

        );

        console.log(

          `✅ ${userIdString} joined room`

        );

      }

    );


    // ======================================
    // SEND MESSAGE
    // ======================================
    socket.on(

      "sendMessage",

      (data) => {

        if (
          !data?.receiverId
        ) return;

        const receiverSockets =

          getUserSockets(
            data.receiverId
          );

        receiverSockets.forEach(

          (socketId) => {

            io.to(socketId).emit(

              "receiveMessage",

              data

            );

          }

        );

      }

    );


    // ======================================
    // USER TYPING
    // ======================================
    socket.on(

      "typing",

      (data) => {

        if (
          !data?.receiverId
        ) return;

        const receiverSockets =

          getUserSockets(
            data.receiverId
          );

        receiverSockets.forEach(

          (socketId) => {

            io.to(socketId).emit(

              "userTyping",

              {

                senderId:
                  data.senderId,

              }

            );

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

        if (
          !data?.receiverId
        ) return;

        const receiverSockets =

          getUserSockets(
            data.receiverId
          );

        receiverSockets.forEach(

          (socketId) => {

            io.to(socketId).emit(

              "userStopTyping",

              {

                senderId:
                  data.senderId,

              }

            );

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

        if (
          !data?.senderId
        ) return;

        const senderSockets =

          getUserSockets(
            data.senderId
          );

        senderSockets.forEach(

          (socketId) => {

            io.to(socketId).emit(

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

      }

    );


    // ======================================
    // MESSAGE SEEN
    // ======================================
    socket.on(

      "messageSeen",

      (data) => {

        if (
          !data?.senderId
        ) return;

        const senderSockets =

          getUserSockets(
            data.senderId
          );

        senderSockets.forEach(

          (socketId) => {

            io.to(socketId).emit(

              "messageSeen",

              {

                messageId:
                  data.messageId,

                status:
                  "seen",

              }

            );

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

          "🔴 User Disconnected:",

          socket.id

        );

      }

    );

  }

);


// ==========================================
// API ROUTES
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
// HEALTH CHECK
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
// FIXED
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
      err
    );

    res.status(500).json({

      success: false,

      message:
        "Internal Server Error",

    });

  }

);


// ==========================================
// SERVER START
// ==========================================
const PORT =
  process.env.PORT || 5000;

server.listen(

  PORT,

  () => {

    console.log(

      `🚀 Server running on port ${PORT}`

    );

  }

);