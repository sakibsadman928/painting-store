import express from "express";
import { createPaymentIntent } from "../controllers/paymentController.js";
import authUser from "../middlewares/authUser.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-intent", authUser, createPaymentIntent);

export default paymentRouter;
