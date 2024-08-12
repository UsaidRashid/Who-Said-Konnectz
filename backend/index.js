const express = require("express");
const app = express();
const cors = require("cors");
const port = 3002;
const path = require('path');

const { createServer } = require("node:http");
const { Server } = require("socket.io");
const server = createServer(app);

require('./configs/dbConfig');
require('./configs/multerConfig');
const sessionConfig = require("./configs/sessionConfig");
const passport = require("./configs/passportConfig");

const MessagesController = require("./controllers/messages");

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, './configs/uploads')));
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = new Map();

io.on("connection", (socket) => {
  console.log("A user connected!", socket.id);

  socket.on("register_user", (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ID: ${socket.id}`);
  });

  socket.on("disconnect", () => {
    userSocketMap.forEach((value, key) => {
      if (value === socket.id) {
        userSocketMap.delete(key);
        console.log(`User ${key} disconnected and removed from the map`);
      }
    });
  });

  socket.on("send_dm", async ({ fromId, toId, message }) => {
    console.log(`Sending DM from ${fromId} to ${toId}: ${message}`);

    try {
      const result = await MessagesController.saveMessage(
        fromId,
        toId,
        message
      );

      if (result.success) {
        const recipientSocketId = userSocketMap.get(toId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receive_dm", { fromId, message });
        }

        socket.emit("receive_dm", { fromId, message });
      } else {
        console.error("Error saving message:", result.message);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });
});


app.use((err, req, res, next) => {
  console.error(err);
  if (err.status) {
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const userRouter = require("./routes/users");
const postRouter = require("./routes/posts");
const commentRouter = require("./routes/comments");
const messageRouter = require("./routes/messages");
const whoSaidRouter = require("./routes/whosaid");

app.use("/", userRouter);
app.use("/posts/", postRouter);
app.use("/comments/", commentRouter);
app.use("/messages/", messageRouter);
app.use("/who-said/", whoSaidRouter);

app.get("/", (req, res, next) => {
  res.send("It's the backend of Who-Said Konnectz!");
});

server.listen(port, () => {
  console.log(`Who-Said Konnectz running on port ${port}`);
});
