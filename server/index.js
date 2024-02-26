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

// app.get("/", (req, res) => {
//   res.send("Welcome");
// });

app.listen(port, () => {
  console.log("Server listening on PORT: " + port);
});
