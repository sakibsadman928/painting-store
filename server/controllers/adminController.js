import Exhibition from "../models/Exhibition.js";
import Ticket from "../models/Ticket.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import jwt from "jsonwebtoken";
import fs from 'fs';

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const adminCredentials = {
            email: "admin@paletteplay.com",
            password: "admin123"
        };
        
        if (email !== adminCredentials.email || password !== adminCredentials.password) {
            return res.json({ success: false, message: "Invalid admin credentials" });
        }
        
        const token = jwt.sign(
            { adminId: "admin", role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        
        res.cookie('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        
        res.json({ 
            success: true, 
            message: "Admin login successful",
            admin: {
                email: email,
                role: 'admin'
            }
        });
        
    } catch (error) {
        console.error('Admin login error:', error);
        res.json({ success: false, message: error.message });
    }
};

const adminLogout = async (req, res) => {
    try {
        res.clearCookie('admin_token', {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
        });
        res.json({ success: true, message: "Admin logged out successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getAdminStatus = async (req, res) => {
    try {
        res.json({ 
            success: true, 
            isAdmin: true,
            adminId: req.adminId 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({})
            .populate('exhibitionId', 'title eventDate eventTime venue')
            .populate('userId', 'name email')
            .sort({ purchaseDate: -1 });

        res.json({ success: true, tickets });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateTicketStatus = async (req, res) => {
    try {
        const { ticketId, status } = req.body;

        const validStatuses = ['active', 'used', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid ticket status" });
        }

        await Ticket.findByIdAndUpdate(ticketId, { ticketStatus: status });
        res.json({ success: true, message: "Ticket status updated successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateExhibitionStatus = async (req, res) => {
    try {
        const { exhibitionId, status } = req.body;

        const validStatuses = ['active', 'sold-out', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid exhibition status" });
        }

        await Exhibition.findByIdAndUpdate(exhibitionId, { status });
        res.json({ success: true, message: "Exhibition status updated successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const deleteExhibition = async (req, res) => {
    try {
        const { exhibitionId } = req.body;

        const exhibition = await Exhibition.findById(exhibitionId);
        if (!exhibition) {
            return res.json({ success: false, message: "Exhibition not found" });
        }

        if (exhibition.image) {
            fs.unlink(`uploads/${exhibition.image}`, () => {});
        }

        await Exhibition.findByIdAndDelete(exhibitionId);
        res.json({ success: true, message: "Exhibition deleted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getProductStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const orders = await Order.find({});
        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        
        const lowStockProducts = await Product.countDocuments({ stock: { $lte: 10 } });
        const outOfStockProducts = await Product.countDocuments({ stock: 0 });

        const stats = {
            totalProducts,
            totalOrders,
            totalRevenue,
            lowStockProducts,
            outOfStockProducts,
            averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0
        };

        res.json({ success: true, stats });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getExhibitionStats = async (req, res) => {
    try {
        const totalExhibitions = await Exhibition.countDocuments();
        const activeExhibitions = await Exhibition.countDocuments({ status: 'active' });
        
        const tickets = await Ticket.find({});
        const totalTicketsSold = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
        const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.totalAmount, 0);

        const upcomingExhibitions = await Exhibition.countDocuments({
            eventDate: { $gte: new Date() },
            status: 'active'
        });

        const stats = {
            totalExhibitions,
            activeExhibitions,
            upcomingExhibitions,
            totalTicketsSold,
            totalRevenue,
            averageTicketPrice: totalTicketsSold > 0 ? (totalRevenue / totalTicketsSold).toFixed(2) : 0
        };

        res.json({ success: true, stats });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getDashboardOverview = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const orders = await Order.find({});
        const productRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

        const totalExhibitions = await Exhibition.countDocuments();
        const tickets = await Ticket.find({});
        const totalTicketsSold = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
        const exhibitionRevenue = tickets.reduce((sum, ticket) => sum + ticket.totalAmount, 0);

        const recentOrders = await Order.find({}).sort({ date: -1 }).limit(5);
        const recentTickets = await Ticket.find({})
            .populate('exhibitionId', 'title')
            .sort({ purchaseDate: -1 })
            .limit(5);

        const overview = {
            productStats: {
                totalProducts,
                totalOrders,
                totalRevenue: productRevenue
            },
            exhibitionStats: {
                totalExhibitions,
                totalTicketsSold,
                totalRevenue: exhibitionRevenue
            },
            totalRevenue: productRevenue + exhibitionRevenue,
            recentOrders,
            recentTickets
        };

        res.json({ success: true, overview });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getMonthlyRevenue = async (req, res) => {
    try {
        const { year = new Date().getFullYear() } = req.query;
        
        const monthlyData = [];
        
        for (let month = 1; month <= 12; month++) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);

            const orders = await Order.find({
                date: { $gte: startDate.getTime(), $lte: endDate.getTime() }
            });
            const productRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

            const tickets = await Ticket.find({
                purchaseDate: { $gte: startDate, $lte: endDate }
            });
            const ticketRevenue = tickets.reduce((sum, ticket) => sum + ticket.totalAmount, 0);

            monthlyData.push({
                month: month,
                monthName: new Date(year, month - 1).toLocaleString('default', { month: 'long' }),
                productRevenue,
                ticketRevenue,
                totalRevenue: productRevenue + ticketRevenue
            });
        }

        res.json({ success: true, monthlyData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { 
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
};