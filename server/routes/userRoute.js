import express from "express";
import { register, login, logout, getProfile, updateProfile } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.get('/profile', authUser, getProfile);
userRouter.put('/profile', authUser, updateProfile);

export default userRouter;