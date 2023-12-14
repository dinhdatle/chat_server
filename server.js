import express from "express";
import chats from "./data/data.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import usersRouter from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";
// import path from "path";
import cors from "cors";
const app = express();

dotenv.config();
connectDB();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;
const client = process.env.CLIENT;

app.get("/", (req, res) => {
  res.send("API is Running");
});

app.use("/api/user", usersRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: client,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    console.log(userData);
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  // socket.on("typing", (room) => {
  //   socket.in(room).emit("typing");
  // });

  // socket.on("stop typing", (room) => {
  //   socket.in(room).emit("stop typing");
  // });

  socket.on("new message", (newMessageRecieved) => {
    console.log("New Message Recieved: ", newMessageRecieved);
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");

    // Kiểm tra xem có tồn tại userData không trước khi sử dụng

    if (socket.userData && socket.userData._id) {
      console.log("User ID: ", socket.userData._id);
      socket.leave(socket.userData._id);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
