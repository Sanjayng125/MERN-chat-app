import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/connection.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { Server } from "socket.io";

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

connectDb();

const port = process.env.PORT || 9000;

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);

// ------------------------------Deployment----------------------------------

const __dirname1 = path.resolve();
app.use(express.static(path.join(__dirname1, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"));
});

// ------------------------------Deployment----------------------------------

// ------------------------------Dev----------------------------------
// app.get("/", (req, res) => {
//   res.send("Welcome");
// });
// ------------------------------Dev----------------------------------

app.listen(port, () => {
  console.log("Server listening on PORT: " + port);
});

// socket io ----------------------------------------------------------------------------------------------------------------
const io = new Server(8800, {
  pingTimeout: 60000,
  cors: {
    // origin: "http://localhost:5173",
    origin: "*",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  //add new user
  socket.on("new-user-add", (newUserId) => {
    //if user is not added previosly
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    io.emit("get-users", activeUsers);
    // console.log("Connected Users", activeUsers);
  });

  // send message
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-users", activeUsers);
    // console.log("User Dissconnected", activeUsers);
  });
});
