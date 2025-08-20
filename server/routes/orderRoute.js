import express from "express";
import { placeOrder, getUserOrders, getAllOrders, updateStatus, getSingleOrder } from "../controllers/orderController.js";
import authUser from "../middlewares/authUser.js";
import authAdmin from "../middlewares/authAdmin.js";

const orderRouter = express.Router();

orderRouter.post('/place', authUser, placeOrder);
orderRouter.post('/userorders', authUser, getUserOrders);
orderRouter.get('/list', authAdmin, getAllOrders);
orderRouter.post('/status', authAdmin, updateStatus);
orderRouter.post('/single', getSingleOrder);

export default orderRouter;