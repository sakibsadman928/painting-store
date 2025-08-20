import express from "express";
import { addToCart, updateCart, getUserCart, removeFromCart, clearCart, getCartCount } from "../controllers/cartController.js";
import authUser from "../middlewares/authUser.js";

const cartRouter = express.Router();

cartRouter.post('/add', authUser, addToCart);
cartRouter.post('/update', authUser, updateCart);
cartRouter.post('/get', authUser, getUserCart);
cartRouter.post('/remove', authUser, removeFromCart);
cartRouter.post('/clear', authUser, clearCart);
cartRouter.get('/count', authUser, getCartCount);

export default cartRouter;