const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const jobRoutes = require("./src/routes/jobRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const mentorshipRoutes = require("./src/routes/mentorshipRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const messageRoutes = require("./src/routes/messageRoutes");

// NEW ROUTES
const userRoutes =
  require("./src/routes/userRoutes");

const guidanceRoutes =
  require("./src/routes/guidanceRoutes");

const recommendationRoutes =
  require("./src/routes/recommendationRoutes");

// AI CHATBOT ROUTE
const chatbotRoutes =
  require("./src/routes/chatbotRoutes");

const adminRoutes =
  require("./src/routes/adminRoutes");


// =========================
// CONFIG
// =========================
dotenv.config();

connectDB();

const app = express();


// =========================
// MIDDLEWARE
// =========================
app.use(cors({

  origin:
    "http://localhost:8080",

  credentials: true,

}));

app.use(express.json());


// =========================
// HTTP SERVER
// =========================
const server =
  http.createServer(app);


// =========================
// SOCKET SERVER
// =========================
const io =
  new Server(server, {

    cors: {

      origin:
        "http://localhost:8080",

      methods: [
        "GET",
        "POST",
      ],

    },

  });


// =========================
// ONLINE USERS MAP
// =========================
const onlineUsers =
  new Map();


// =========================
// SOCKET LOGIC
// =========================
io.on(
  "connection",
  (socket) => {

    console.log(
      "🟢 User Connected:",
      socket.id
    );


    // =========================
    // JOIN ROOM
    // =========================
    socket.on(
      "joinRoom",
      (userId) => {

        if (!userId) return;

        socket.join(userId);

        onlineUsers.set(
          userId.toString(),
          socket.id
        );

        io.emit(
          "onlineUsers",
          Array.from(
            onlineUsers.keys()
          )
        );

        console.log(
          "User joined:",
          userId
        );

      }
    );


    // =========================
    // SEND MESSAGE
    // =========================
    socket.on(
      "sendMessage",
      (data) => {

        if (!data?.receiverId)
          return;

        io.to(
          data.receiverId
        ).emit(
          "receiveMessage",
          data
        );

      }
    );


    // =========================
    // USER TYPING
    // =========================
    socket.on(
      "typing",
      (data) => {

        if (!data?.receiverId)
          return;

        socket.to(
          data.receiverId
        ).emit(
          "userTyping",
          {

            senderId:
              data.senderId ||
              data.receiverId,

          }
        );

      }
    );


    // =========================
    // STOP TYPING
    // =========================
    socket.on(
      "stopTyping",
      (data) => {

        if (!data?.receiverId)
          return;

        socket.to(
          data.receiverId
        ).emit(
          "userStopTyping"
        );

      }
    );


    // =========================
    // MESSAGE DELIVERED
    // =========================
    socket.on(
      "messageDelivered",
      (data) => {

        if (!data?.senderId)
          return;

        io.to(
          data.senderId
        ).emit(
          "messageDelivered",
          {

            status:
              "delivered",

          }
        );

      }
    );


    // =========================
    // MESSAGE SEEN
    // =========================
    socket.on(
      "messageSeen",
      (data) => {

        if (!data?.senderId)
          return;

        io.to(
          data.senderId
        ).emit(
          "messageSeen",
          {

            status:
              "seen",

          }
        );

      }
    );


    // =========================
    // DISCONNECT
    // =========================
    socket.on(
      "disconnect",
      () => {

        let disconnectedUser =
          null;

        for (
          const [
            userId,
            socketId,
          ]
          of onlineUsers.entries()
        ) {

          if (
            socketId ===
            socket.id
          ) {

            onlineUsers.delete(
              userId
            );

            disconnectedUser =
              userId;

            break;

          }

        }

        io.emit(
          "onlineUsers",
          Array.from(
            onlineUsers.keys()
          )
        );

        console.log(
          "🔴 User Disconnected:",
          disconnectedUser ||
            socket.id
        );

      }
    );

  }
);


// =========================
// ROUTES
// =========================
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

// NEW
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

// AI CHATBOT
app.use(
  "/ai",
  chatbotRoutes
);


// =========================
// TEST ROUTE
// =========================
app.get(
  "/",
  (req, res) => {

    res.send(
      "AlumniConnect Backend Running 🚀"
    );

  }
);


// =========================
// START SERVER
// =========================
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