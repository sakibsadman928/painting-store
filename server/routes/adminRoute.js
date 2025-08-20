import express from "express";
import { 
    adminLogin,
    adminLogout,
    getAdminStatus,
    getAllTickets, 
    updateTicketStatus, 
    updateExhibitionStatus, 
    deleteExhibition, 
    getProductStats, 
    getExhibitionStats, 
    getDashboardOverview,
    getMonthlyRevenue
} from "../controllers/adminController.js";
import authAdmin from "../middlewares/authAdmin.js";

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/status', authAdmin, getAdminStatus);
adminRouter.post('/logout', authAdmin, adminLogout);

adminRouter.get('/dashboard', authAdmin, getDashboardOverview);
adminRouter.get('/revenue/monthly', authAdmin, getMonthlyRevenue);

adminRouter.get('/stats/products', authAdmin, getProductStats);
adminRouter.get('/stats/exhibitions', authAdmin, getExhibitionStats);
adminRouter.post('/exhibition/status', authAdmin, updateExhibitionStatus);
adminRouter.post('/exhibition/delete', authAdmin, deleteExhibition);

adminRouter.get('/tickets', authAdmin, getAllTickets);
adminRouter.post('/ticket/status', authAdmin, updateTicketStatus);

export default adminRouter;