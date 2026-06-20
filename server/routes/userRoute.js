import express from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  googleCallback,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/profile", authUser, getProfile);
userRouter.put("/profile", authUser, updateProfile);

userRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173",
    session: false,
  }),
  googleCallback,
);

export default userRouter;
