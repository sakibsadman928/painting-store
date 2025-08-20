import express from "express";
import { addAddress, getUserAddresses, updateAddress, deleteAddress, setDefaultAddress } from "../controllers/addressController.js";
import authUser from "../middlewares/authUser.js";


const addressRouter = express.Router();

addressRouter.post('/add', authUser, addAddress);
addressRouter.get('/list', authUser, getUserAddresses);
addressRouter.put('/update', authUser, updateAddress);
addressRouter.post('/delete', authUser, deleteAddress);
addressRouter.post('/default', authUser, setDefaultAddress);

export default addressRouter;