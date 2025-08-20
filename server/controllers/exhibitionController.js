import Exhibition from "../models/Exhibition.js";
import Ticket from "../models/Ticket.js";
import exhibitionService from "../services/exhibitionService.js";
import fs from 'fs';

const addExhibition = async (req, res) => {
    try {
        const { title, description, eventDate, eventTime, venue, totalTickets, ticketPrice } = req.body;
        
        const eventDateObj = new Date(eventDate);
        const month = eventDateObj.getMonth() + 1;
        const year = eventDateObj.getFullYear();

        const exhibitionData = {
            title,
            description,
            eventDate: eventDateObj,
            eventTime,
            venue: venue || "Palette Play Gallery",
            totalTickets: Number(totalTickets),
            availableTickets: Number(totalTickets),
            ticketPrice: Number(ticketPrice),
            month,
            year
        };

        if (req.file) {
            exhibitionData.image = req.file.filename;
        }

        const exhibition = new Exhibition(exhibitionData);
        await exhibition.save();

        res.json({ success: true, message: "Exhibition Added", exhibition });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const updateExhibition = async (req, res) => {
    try {
        const { exhibitionId, title, description, eventDate, eventTime, venue, totalTickets, ticketPrice } = req.body;
        
        const exhibition = await Exhibition.findById(exhibitionId);
        if (!exhibition) {
            return res.json({ success: false, message: "Exhibition not found" });
        }

        const eventDateObj = new Date(eventDate);
        const month = eventDateObj.getMonth() + 1;
        const year = eventDateObj.getFullYear();

        const ticketsSold = exhibition.totalTickets - exhibition.availableTickets;
        const newTotalTickets = Number(totalTickets);
        const newAvailableTickets = Math.max(0, newTotalTickets - ticketsSold);

        const updateData = {
            title,
            description,
            eventDate: eventDateObj,
            eventTime,
            venue: venue || "Palette Play Gallery",
            totalTickets: newTotalTickets,
            availableTickets: newAvailableTickets,
            ticketPrice: Number(ticketPrice),
            month,
            year
        };

        if (req.file) {
            if (exhibition.image) {
                fs.unlink(`uploads/${exhibition.image}`, () => {});
            }
            updateData.image = req.file.filename;
        }

        await Exhibition.findByIdAndUpdate(exhibitionId, updateData);
        res.json({ success: true, message: "Exhibition Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getCurrentMonthExhibitions = async (req, res) => {
    try {
        const exhibitions = await exhibitionService.getCurrentMonthExhibitions();
        res.json({ success: true, exhibitions });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getSingleExhibition = async (req, res) => {
    try {
        const { exhibitionId } = req.body;
        const exhibition = await exhibitionService.getExhibitionById(exhibitionId);
        res.json({ success: true, exhibition });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const purchaseTickets = async (req, res) => {
    try {
        const { exhibitionId, quantity, paymentMethod } = req.body;

        const exhibition = await Exhibition.findById(exhibitionId);
        if (!exhibition) {
            return res.json({ success: false, message: "Exhibition not found" });
        }

        if (exhibition.availableTickets < quantity) {
            return res.json({ success: false, message: "Not enough tickets available" });
        }

        if (exhibition.status !== 'active') {
            return res.json({ success: false, message: "Exhibition is not available for booking" });
        }

        const totalAmount = exhibition.ticketPrice * quantity;
        const ticketNumber = await exhibitionService.generateTicketNumber();

        const ticketData = {
            userId: req.userId,
            exhibitionId,
            ticketNumber,
            quantity: Number(quantity),
            totalAmount,
            paymentMethod,
            paymentStatus: 'completed'
        };

        const ticket = new Ticket(ticketData);
        await ticket.save();

        await Exhibition.findByIdAndUpdate(exhibitionId, {
            $inc: { availableTickets: -quantity },
            $set: { status: exhibition.availableTickets - quantity === 0 ? 'sold-out' : 'active' }
        });

        const populatedTicket = await Ticket.findById(ticket._id)
            .populate('exhibitionId', 'title eventDate eventTime venue');

        res.json({ 
            success: true, 
            message: "Tickets purchased successfully",
            ticket: populatedTicket
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getUserTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ userId: req.userId })
            .populate('exhibitionId', 'title eventDate eventTime venue image')
            .sort({ purchaseDate: -1 });

        res.json({ success: true, tickets });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getAllExhibitions = async (req, res) => {
    try {
        const { month, year } = req.query;
        const exhibitions = await exhibitionService.getExhibitionsByMonth(month, year);
        res.json({ success: true, exhibitions });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { 
    addExhibition,
    updateExhibition,
    getCurrentMonthExhibitions, 
    getSingleExhibition, 
    purchaseTickets, 
    getUserTickets, 
    getAllExhibitions 
};