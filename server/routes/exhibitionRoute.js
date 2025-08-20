import express from "express";
import { 
    addExhibition,
    updateExhibition,
    getCurrentMonthExhibitions, 
    getSingleExhibition, 
    purchaseTickets, 
    getUserTickets, 
    getAllExhibitions 
} from "../controllers/exhibitionController.js";
import authUser from "../middlewares/authUser.js";
import authAdmin from "../middlewares/authAdmin.js";
import upload from "../middlewares/multer.js";

const exhibitionRouter = express.Router();

exhibitionRouter.post('/add', authAdmin, upload.single('image'), addExhibition);
exhibitionRouter.put('/update', authAdmin, upload.single('image'), updateExhibition);
exhibitionRouter.get('/current', getCurrentMonthExhibitions);
exhibitionRouter.post('/single', getSingleExhibition);
exhibitionRouter.post('/purchase', authUser, purchaseTickets);
exhibitionRouter.get('/tickets', authUser, getUserTickets);
exhibitionRouter.get('/list', getAllExhibitions);

export default exhibitionRouter;