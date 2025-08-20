import express from "express";
import { addRating, getProductRatings, getUserRating, canUserRate, deleteRating } from "../controllers/ratingController.js";
import authUser from "../middlewares/authUser.js";

const ratingRouter = express.Router();

ratingRouter.post('/add', authUser, addRating);
ratingRouter.post('/get', getProductRatings);
ratingRouter.post('/user', authUser, getUserRating);
ratingRouter.post('/can-rate', authUser, canUserRate);
ratingRouter.post('/delete', authUser, deleteRating);

export default ratingRouter;