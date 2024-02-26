import express from "express";
import { register, login, logout } from "../controllers/authController.js";
const router = express.Router();

//register new user
router.post("/register", register);

//login user
router.post("/login", login);

//log-out user
router.get("/logout", logout);

export default router;
