import express from "express";
import {
  getUser,
  profilePhotoUpdate,
  profileUpdate,
  getUserByEmail,
  searchUsers,
} from "../controllers/userController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/user-auth", requireSignIn, (req, res) => {
  return res.status(200).send({ ok: true });
});
router.get("/get-user/:userId", requireSignIn, getUser);

router.post("/update-profile/:id", requireSignIn, profileUpdate);

router.post("/update-profile-photo/:id", requireSignIn, profilePhotoUpdate);

router.get("/get-user-email/:email", requireSignIn, getUserByEmail);

router.get("/search-users/:query", requireSignIn, searchUsers);

export default router;
